import React, { useState } from "react";
import { IFCViewer } from "./IFCViewer";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

// --- Sample API payloads and responses as mock data (fm) ---
export const fm = {
  generateDraftRequest: {
    description: "Flag all doors whose threshold (Z-min) is below 20 mm as errors",
  },
  generateDraftResponse: {
    code: `from ifcopenshell import open as ifc_open
from typing import List

class CheckResult:
    def __init__(self, ok: bool, message: str):
        self.ok = ok
        self.message = message

def check(model) -> List[CheckResult]:
    """
    Flag IfcDoor elements with ThresholdZ < 0.02 m
    """
    results = []
    doors = model.by_type("IfcDoor")
    for d in doors:
        zmin = d.OverallHeight if hasattr(d, "OverallHeight") else None
        if zmin is not None and zmin < 0.02:
            results.append(CheckResult(False,
                f"Door '{d.GlobalId}' threshold at {zmin:.3f} m is below 0.02 m"))
        else:
            results.append(CheckResult(True,
                f"Door '{d.GlobalId}' passes threshold check ({zmin:.3f} m)"))
    return results`,
    summary: "Flag IfcDoor elements whose threshold Z-min is less than 0.02 m",
  },
  uploadResponse: {
    id: "ifc_abc123",
    filename: "Floorplan_GlilYam.ifc",
  },
  validateRequest: {
    code: "<the full draft code string from generate-draft>",
    ifcFileId: "ifc_abc123",
  },
  validateResponse: {
    results: [
      { ok: false, message: "Door '3s8dF9' threshold at 0.015 m is below 0.02 m" },
      { ok: true, message: "Door '7GhJk2' passes threshold check (0.025 m)" },
    ],
    overall: false,
  },
  createRuleRequest: {
    description: "Flag all doors whose threshold (Z-min) is below 20 mm as errors",
    code: "<the approved Python code string>",
    summary: "Flag IfcDoor elements whose threshold Z-min is less than 0.02 m",
  },
  createRuleResponse: {
    id: "rule_67890",
    createdAt: "2025-04-23T11:45:00+03:00",
    status: "published",
  },
  refineRequest: {
    code: "<the prior draft code string>",
    feedback: "It didn’t catch windows with the same issue — please include IfcWindow as well.",
  },
  refineResponse: {
    code: `from ifcopenshell import open as ifc_open
from typing import List

class CheckResult:
    def __init__(self, ok: bool, message: str):
        self.ok = ok
        self.message = message

def check(model) -> List[CheckResult]:
    """
    Flag IfcDoor and IfcWindow elements with ThresholdZ < 0.02 m
    """
    results = []
    for entity in ("IfcDoor", "IfcWindow"):
        elems = model.by_type(entity)
        for e in elems:
            zmin = getattr(e, "OverallHeight", None)
            if zmin is not None and zmin < 0.02:
                results.append(CheckResult(False,
                    f"{entity} '{e.GlobalId}' threshold at {zmin:.3f} m is below 0.02 m"))
            else:
                results.append(CheckResult(True,
                    f"{entity} '{e.GlobalId}' passes threshold check ({zmin:.3f} m)"))
    return results`,
    summary: "Flag IfcDoor and IfcWindow elements whose threshold Z-min is less than 0.02 m",
  },
};

interface CheckResult {
  ok: boolean;
  message: string;
}

export const RuleAuthoringStudio: React.FC = () => {
  const [description, setDescription] = useState("");
  const [draftCode, setDraftCode] = useState("");
  const [summary, setSummary] = useState("");
  const [ifcFileId, setIfcFileId] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<CheckResult[] | null>(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // 1. Generate draft code
  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use mock when description matches sample
      const body = description === fm.generateDraftRequest.description
        ? fm.generateDraftResponse
        : await fetch("/api/rules/generate-draft", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ description }),
          }).then((r) => r.json());
      setDraftCode(body.code);
      setSummary(body.summary);
      setTestResults(null);
      setFeedback("");
    } catch (err: any) {
      setError(err.message || "Failed to generate draft");
    } finally {
      setLoading(false);
    }
  };

  // 2. Upload IFC model
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const data = fm.uploadResponse; // mock
      setIfcFileId(data.id);
      setSelectedFile(file);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 3. Test draft against IFC
  const handleTest = async () => {
    if (!draftCode || !ifcFileId) return;
    setLoading(true);
    try {
      const body = draftCode === fm.generateDraftResponse.code
        ? fm.validateResponse
        : await fetch("/api/rules/validate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: draftCode, ifcFileId }),
          }).then((r) => r.json());
      setTestResults(body.results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 4a. Approve rule
  const handleApprove = async () => {
    if (!draftCode) return;
    setLoading(true);
    try {
      const body = fm.createRuleResponse; // mock
      alert(`Rule ${body.id} approved and saved!`);
      setDescription("");
      setDraftCode("");
      setSummary("");
      setIfcFileId(null);
      setTestResults(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 4b. Refine draft with feedback
  const handleRefine = async () => {
    if (!draftCode || !feedback.trim()) return;
    setLoading(true);
    try {
      const body = fm.refineResponse; // mock
      setDraftCode(body.code);
      setSummary(body.summary);
      setTestResults(null);
      setFeedback("");
    } catch (err: any) {
      setError(err.message || "Failed to refine draft");
    } finally {
      setLoading(false);
    }
  };

  const clearData =  () => {
    setDescription("");
    setDraftCode("");
    setSummary("");
    setIfcFileId(null);
    setTestResults(null);
    setFeedback("");
    setSelectedFile(null);
  };



  // 4c. Save rule
  const handleSave = async () => {
    if (!draftCode) return;
    setLoading(true);
    try {
      // const response = await fetch("/api/rules/save", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     description,
      //     code: draftCode,
      //     summary
      //   }),
      // });
      // const data = await response.json();
      alert('Rule saved successfully!');
      // Clear all form data after successful save
      clearData();
    } catch (err) {
      console.error(err);
      setError("Failed to save rule");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, p: 2, height: 'calc(100vh - 48px)' }}>
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <Typography variant="h4" gutterBottom>
          Rule Authoring Studio
        </Typography>

        {/* 1. Description */}
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6">Rule Description</Typography>
          <TextField
            fullWidth multiline rows={3}
            label="Describe your rule"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button
            variant="contained" color="primary"
            onClick={handleGenerate}
            disabled={loading || !description.trim()}
          >{loading ? "Generating..." : "Generate Draft"}</Button>
        </Paper>

     
        {draftCode && summary && (
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
              Preview: {summary}
            </Typography>
          </Paper>
        )}

        {/* 3. Upload & Test */}
        {draftCode && (
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">Upload IFC to Test</Typography>
            <Button variant="contained" component="label" color="success">
              Upload IFC<input type="file" hidden accept=".ifc" onChange={handleUpload} />
            </Button>
            <Button sx={{ ml: 2 }}
              variant="contained" color="success"
              onClick={handleTest}
              disabled={loading || !ifcFileId}
            >{loading ? "Testing..." : "Run Test"}</Button>
          </Paper>
        )}

        {/* 4. Results & actions */}
        {testResults && (
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">Test Results</Typography>
            <List>
              {testResults.map((r, i) => (
                <ListItem key={i}>
                  <ListItemIcon>
                    {r.ok ? <CheckIcon color="success" /> : <CloseIcon color="error" />}
                  </ListItemIcon>
                  <ListItemText primary={r.message} primaryTypographyProps={{color: r.ok ? 'textPrimary' : 'error'}}/>
                </ListItem>
              ))}
            </List>
            {testResults.every(r => r.ok) ? (
              <Button variant="contained" color="secondary" onClick={handleApprove} disabled={loading}>
                {loading ? "Saving..." : "Approve Rule"}
              </Button>
            ) : (
              <Box>
                <Typography variant="subtitle1">Feedback</Typography>
                <TextField fullWidth multiline rows={2} value={feedback} onChange={e => setFeedback(e.target.value)} margin="normal"/>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button variant="contained" color="warning" onClick={handleRefine} disabled={loading || !feedback.trim()}>
                    {loading ? "Refining..." : "Refine Rule"}
                  </Button>
                  <Button variant="contained" color="info" onClick={handleSave} disabled={loading}>
                    {loading ? "Saving..." : "Save Rule"}
                  </Button>
                </Box>
              </Box>
            )}
          </Paper>
        )}
      </Box>

      <Box sx={{ width: '50%', display: 'flex', flexDirection: 'column' }}>
        {selectedFile ? (
          <IFCViewer 
            file={selectedFile}
            onError={(error) => console.error(error)}
          />
        ) : (
          <Paper sx={{ p: 2, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              Upload an IFC file to view the model
            </Typography>
          </Paper>
        )}
      </Box>
    </Box>
  );
};
