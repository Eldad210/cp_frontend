import type { AnalysisResponse } from '@/api/analysisService';
import {
  IfcAPI,
  IFCDOOR,
  IFCRAILING,
  IFCRAMP,
  IFCRAMPFLIGHT,
  IFCSTAIR,
  IFCSTAIRFLIGHT,
} from 'web-ifc';

type AnalysisLanguage = 'HE' | 'EN';
type SelectedCode = { countryCode: string; codeNum: string };
type IssueType = 'error' | 'warning' | 'success';

interface IfcElementSummary {
  expressId: number;
  globalId?: string;
  name: string;
  widthMm?: number;
}

interface LocalModelIndex {
  doors: IfcElementSummary[];
  railings: IfcElementSummary[];
  ramps: IfcElementSummary[];
  stairs: IfcElementSummary[];
}

const DOOR_CLEAR_WIDTH_MM = 800;
const MAX_DETAILED_ISSUES = 50;

const message = (language: AnalysisLanguage, he: string, en: string) => (
  language === 'HE' ? he : en
);

const issue = (messageType: IssueType, text: string) => ({
  messageType,
  message: text,
});

const unwrapIfcValue = (value: unknown): unknown => {
  if (value && typeof value === 'object' && 'value' in value) {
    return (value as { value: unknown }).value;
  }

  return value;
};

const stringValue = (value: unknown): string | undefined => {
  const unwrapped = unwrapIfcValue(value);
  return typeof unwrapped === 'string' && unwrapped.trim() ? unwrapped.trim() : undefined;
};

const numericValue = (value: unknown): number | undefined => {
  const unwrapped = unwrapIfcValue(value);
  if (typeof unwrapped === 'number' && Number.isFinite(unwrapped)) {
    return unwrapped;
  }

  if (typeof unwrapped === 'string') {
    const parsed = Number.parseFloat(unwrapped.replace(',', '.'));
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
};

const normalizeLengthToMillimeters = (value: number | undefined): number | undefined => {
  if (value === undefined) return undefined;

  const absoluteValue = Math.abs(value);
  if (absoluteValue <= 10) return value * 1000;
  if (absoluteValue <= 500) return value * 10;
  return value;
};

const formatMm = (value: number) => `${Math.round(value)} mm`;

const elementLabel = (element: IfcElementSummary, language: AnalysisLanguage) => {
  const idText = element.globalId ? `, GlobalId ${element.globalId}` : '';
  return message(
    language,
    `"${element.name}" (ExpressID #${element.expressId}${idText})`,
    `"${element.name}" (ExpressID #${element.expressId}${idText})`,
  );
};

const getElementsByType = (
  api: IfcAPI,
  modelID: number,
  typeCode: number,
  widthField?: string,
): IfcElementSummary[] => {
  try {
    const ids = api.GetLineIDsWithType(modelID, typeCode, true);
    const elements: IfcElementSummary[] = [];

    for (let index = 0; index < ids.size(); index += 1) {
      const expressId = ids.get(index);
      const line = api.GetLine(modelID, expressId);
      const globalId = stringValue(line?.GlobalId);
      const name = stringValue(line?.Name) || stringValue(line?.ObjectType) || globalId || `#${expressId}`;
      const rawWidth = widthField ? numericValue(line?.[widthField]) : undefined;
      const widthMm = normalizeLengthToMillimeters(rawWidth);

      elements.push({ expressId, globalId, name, widthMm });
    }

    return elements;
  } catch (error) {
    console.warn(`Failed reading IFC type ${typeCode}`, error);
    return [];
  }
};

const createModelIndex = async (file: File): Promise<LocalModelIndex> => {
  const api = new IfcAPI();
  const wasmPath = `${import.meta.env.BASE_URL || '/'}ifcjs/`;
  api.SetWasmPath(wasmPath, true);
  await api.Init();

  const data = new Uint8Array(await file.arrayBuffer());
  const modelID = api.OpenModel(data, {
    COORDINATE_TO_ORIGIN: false,
    USE_FAST_BOOLS: true,
  });

  try {
    const doors = getElementsByType(api, modelID, IFCDOOR, 'OverallWidth');
    const railings = getElementsByType(api, modelID, IFCRAILING);
    const ramps = [
      ...getElementsByType(api, modelID, IFCRAMP),
      ...getElementsByType(api, modelID, IFCRAMPFLIGHT),
    ];
    const stairs = [
      ...getElementsByType(api, modelID, IFCSTAIR),
      ...getElementsByType(api, modelID, IFCSTAIRFLIGHT),
    ];

    return { doors, railings, ramps, stairs };
  } finally {
    api.CloseModel(modelID);
  }
};

const analyzeDoorWidth = (model: LocalModelIndex, language: AnalysisLanguage) => {
  const issues = [];
  const measuredDoors = model.doors.filter((door) => door.widthMm !== undefined);
  const narrowDoors = measuredDoors.filter((door) => (door.widthMm ?? 0) < DOOR_CLEAR_WIDTH_MM);
  const missingWidthCount = model.doors.length - measuredDoors.length;

  if (model.doors.length === 0) {
    issues.push(issue(
      'warning',
      message(
        language,
        'לא זוהו דלתות במודל IFC ולכן לא ניתן לבדוק רוחב פתח.',
        'No doors were found in the IFC model, so door clear width cannot be checked.',
      ),
    ));
  }

  narrowDoors.slice(0, MAX_DETAILED_ISSUES).forEach((door) => {
    issues.push(issue(
      'error',
      message(
        language,
        `דלת ${elementLabel(door, language)} ברוחב ${formatMm(door.widthMm ?? 0)}, מתחת למינימום ${DOOR_CLEAR_WIDTH_MM} mm.`,
        `Door ${elementLabel(door, language)} is ${formatMm(door.widthMm ?? 0)}, below the ${DOOR_CLEAR_WIDTH_MM} mm minimum.`,
      ),
    ));
  });

  if (narrowDoors.length > MAX_DETAILED_ISSUES) {
    issues.push(issue(
      'warning',
      message(
        language,
        `נמצאו עוד ${narrowDoors.length - MAX_DETAILED_ISSUES} דלתות צרות שלא פורטו בדוח המקוצר.`,
        `${narrowDoors.length - MAX_DETAILED_ISSUES} additional narrow doors were omitted from the compact report.`,
      ),
    ));
  }

  if (missingWidthCount > 0) {
    issues.push(issue(
      'warning',
      message(
        language,
        `זוהו ${missingWidthCount} דלתות ללא שדה OverallWidth. נדרש להשלים נתון רוחב או להריץ בדיקת גיאומטריה מלאה בשרת.`,
        `${missingWidthCount} doors do not include OverallWidth. Add width data or run the full server geometry check.`,
      ),
    ));
  }

  if (model.doors.length > 0 && narrowDoors.length === 0 && measuredDoors.length > 0) {
    issues.push(issue(
      'success',
      message(
        language,
        `נבדקו ${measuredDoors.length} דלתות עם OverallWidth. כל הפתחים שנמדדו עומדים במינימום ${DOOR_CLEAR_WIDTH_MM} mm.`,
        `${measuredDoors.length} doors with OverallWidth were checked. All measured openings meet the ${DOOR_CLEAR_WIDTH_MM} mm minimum.`,
      ),
    ));
  }

  return issues;
};

const analyzeGuardrails = (model: LocalModelIndex, language: AnalysisLanguage) => {
  if (model.railings.length === 0) {
    return [issue(
      'warning',
      message(
        language,
        'לא זוהו מעקות במודל IFC. אם קיימים מפלסים, מדרגות או כבשים, יש לוודא שהמעקות מודלו כ-IfcRailing.',
        'No railings were found in the IFC model. If levels, stairs, or ramps exist, verify that guardrails are modeled as IfcRailing.',
      ),
    )];
  }

  return [issue(
    'warning',
    message(
      language,
      `זוהו ${model.railings.length} מעקות. הבדיקה המקומית מאשרת נוכחות בלבד; אימות גובה מעקה דורש חישוב גיאומטרי מלא בשרת.`,
      `${model.railings.length} railings were found. The local check verifies presence only; guardrail height requires the full server geometry engine.`,
    ),
  )];
};

const analyzeRamps = (model: LocalModelIndex, language: AnalysisLanguage, codeNum: string) => {
  if (model.ramps.length === 0) {
    return [issue(
      'warning',
      message(
        language,
        `לא זוהו כבשים במודל IFC עבור חוק ${codeNum}. אם יש כבש בתכנית, יש לוודא שהוא ממודל כ-IfcRamp או IfcRampFlight.`,
        `No ramps were found for rule ${codeNum}. If a ramp exists, verify that it is modeled as IfcRamp or IfcRampFlight.`,
      ),
    )];
  }

  return [issue(
    'warning',
    message(
      language,
      `זוהו ${model.ramps.length} כבשים. בדיקת רוחב, שיפוע ומשטחי ביניים דורשת גיאומטריה מלאה ולכן מסומנת כבדיקה ראשונית.`,
      `${model.ramps.length} ramps were found. Width, slope, and landing checks require full geometry and are marked as preliminary.`,
    ),
  )];
};

const analyzeRampHandrails = (model: LocalModelIndex, language: AnalysisLanguage) => {
  const issues = [...analyzeRamps(model, language, '11')];

  if (model.ramps.length > 0 && model.railings.length === 0) {
    issues.push(issue(
      'error',
      message(
        language,
        'זוהו כבשים ללא מעקות במודל. יש לבדוק דרישת מאחזי יד/מעקות לאורך הכבשים.',
        'Ramps were found without any modeled railings. Check handrail/guardrail requirements along the ramps.',
      ),
    ));
  }

  if (model.ramps.length > 0 && model.railings.length > 0) {
    issues.push(issue(
      'warning',
      message(
        language,
        `זוהו ${model.railings.length} מעקות לצד ${model.ramps.length} כבשים. התאמה צדדית וגובה מאחז יד דורשים בדיקה מרחבית בשרת.`,
        `${model.railings.length} railings and ${model.ramps.length} ramps were found. Side alignment and handrail height require the server spatial check.`,
      ),
    ));
  }

  return issues;
};

const analyzeDoorNearStairs = (model: LocalModelIndex, language: AnalysisLanguage) => {
  if (model.stairs.length === 0) {
    return [issue(
      'success',
      message(
        language,
        'לא זוהו מדרגות במודל ולכן לא נמצאה נקודת בדיקה לדלת סמוכה למדרגות.',
        'No stairs were found, so no door-near-stair condition was detected.',
      ),
    )];
  }

  if (model.doors.length === 0) {
    return [issue(
      'warning',
      message(
        language,
        `זוהו ${model.stairs.length} מדרגות אך לא זוהו דלתות. יש לוודא שהדלתות מודלו כ-IfcDoor.`,
        `${model.stairs.length} stairs were found but no doors were detected. Verify that doors are modeled as IfcDoor.`,
      ),
    )];
  }

  return [issue(
    'warning',
    message(
      language,
      `זוהו ${model.doors.length} דלתות ו-${model.stairs.length} מדרגות. בדיקת מרחק דלת ממדרגות דורשת קשר מרחבי מלא ולכן מסומנת כבדיקה ראשונית.`,
      `${model.doors.length} doors and ${model.stairs.length} stairs were found. Door-to-stair clearance requires full spatial analysis and is marked as preliminary.`,
    ),
  )];
};

const analyzeCode = (
  code: SelectedCode,
  model: LocalModelIndex,
  language: AnalysisLanguage,
): NonNullable<AnalysisResponse['results']>[number] => {
  let issues;

  switch (code.codeNum) {
    case '6':
      issues = analyzeGuardrails(model, language);
      break;
    case '7':
    case '8':
      issues = analyzeRamps(model, language, code.codeNum);
      break;
    case '9':
      issues = analyzeDoorWidth(model, language);
      break;
    case '10':
      issues = analyzeDoorNearStairs(model, language);
      break;
    case '11':
      issues = analyzeRampHandrails(model, language);
      break;
    default:
      issues = [issue(
        'warning',
        message(
          language,
          `חוק ${code.codeNum} עדיין לא נתמך במנוע הבדיקה המקומי. יש להריץ אותו דרך שרת הניתוח לאחר פריסה.`,
          `Rule ${code.codeNum} is not supported by the local checker yet. Run it through the analysis server after deployment.`,
        ),
      )];
      break;
  }

  const hasErrors = issues.some((item) => item.messageType === 'error');

  return {
    countryCode: code.countryCode,
    codeNum: code.codeNum,
    checked: !hasErrors,
    checkedCorrectly: !hasErrors,
    issues,
  };
};

export const runLocalIfcAnalysis = async (
  file: File,
  selectedCodes: SelectedCode[],
  language: AnalysisLanguage,
): Promise<AnalysisResponse> => {
  try {
    const model = await createModelIndex(file);
    const results = selectedCodes.map((code) => analyzeCode(code, model, language));

    return {
      success: true,
      results,
    };
  } catch (error) {
    console.error('Local IFC analysis failed:', error);
    return {
      success: false,
      message: message(
        language,
        'הבדיקה המקומית של קובץ ה-IFC נכשלה. בדוק את הקובץ ונסה שוב.',
        'Local IFC analysis failed. Check the IFC file and try again.',
      ),
    };
  }
};
