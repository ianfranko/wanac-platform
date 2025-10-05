"use client";

import React, { useCallback, useRef, useEffect, useState, memo } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Upload, RefreshCw, CheckCircle2, Loader2, AlertCircle, X } from 'lucide-react';

// Constants
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const DEBOUNCE_DELAY = 500;

// URL validation utility
function isValidUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

// Debounce utility with cleanup
function useDebounce(callback, delay) {
  const timeoutRef = useRef(null);
  const callbackRef = useRef(callback);
  
  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  return useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      callbackRef.current(...args);
    }, delay);
  }, [delay]);
}

// Sub-component for Agenda Step
const AgendaStepItem = memo(function AgendaStepItem({ 
  step, 
  idx, 
  onUpdate, 
  onDelete, 
  canDelete,
  experienceService,
  setError 
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const debouncedUpdate = useDebounce(async (field, value) => {
    if (step.id) {
      setIsSaving(true);
      setSaveSuccess(false);
      try {
        await experienceService.updateAgendaStep(step.id, { [field]: value });
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
      } catch (error) {
        console.error('Failed to update agenda step:', error);
        setError(`Failed to update agenda step: ${error.message}`);
      } finally {
        setIsSaving(false);
      }
    }
  }, DEBOUNCE_DELAY);

  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:border-gray-300 transition-colors">
      <div className="flex gap-3">
        <div className="flex-1 space-y-3">
          <div className="relative">
            <Input
              placeholder="Step Title"
              value={step.title || ''}
              onChange={(e) => {
                const newTitle = e.target.value;
                onUpdate(idx, 'title', newTitle);
                debouncedUpdate('title', newTitle);
              }}
              className="bg-white"
              aria-label={`Agenda step ${idx + 1} title`}
            />
            {isSaving && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-blue-500" />
            )}
            {saveSuccess && (
              <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
            )}
          </div>
          <Input
            placeholder="Duration (e.g., 15 minutes)"
            value={step.duration || ''}
            onChange={(e) => {
              const newDuration = e.target.value;
              onUpdate(idx, 'duration', newDuration);
              debouncedUpdate('duration', newDuration);
            }}
            className="bg-white"
            aria-label={`Agenda step ${idx + 1} duration`}
          />
        </div>
        <Button
          type="button"
          variant="destructive"
          size="icon"
          onClick={onDelete}
          disabled={!canDelete}
          className="shrink-0"
          aria-label={`Delete agenda step ${step.title || idx + 1}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
});

AgendaStepItem.propTypes = {
  step: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    duration: PropTypes.string,
  }).isRequired,
  idx: PropTypes.number.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  canDelete: PropTypes.bool.isRequired,
  experienceService: PropTypes.object.isRequired,
  setError: PropTypes.func.isRequired,
};

// Sub-component for Exhibit
const ExhibitItem = memo(function ExhibitItem({ 
  exhibit, 
  idx, 
  onUpdate, 
  onDelete, 
  canDelete,
  experienceService,
  setError 
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [linkError, setLinkError] = useState('');

  const debouncedUpdate = useDebounce(async (field, value) => {
    if (exhibit.id) {
      setIsSaving(true);
      setSaveSuccess(false);
      try {
        await experienceService.updateExhibit(exhibit.id, { [field]: value });
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
      } catch (error) {
        console.error('Failed to update exhibit:', error);
        setError(`Failed to update exhibit: ${error.message}`);
      } finally {
        setIsSaving(false);
      }
    }
  }, DEBOUNCE_DELAY);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError(`File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`);
      e.target.value = ''; // Reset input
      return;
    }

    // Validate file type
    const validTypes = {
      image: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
      video: ['video/mp4', 'video/webm', 'video/ogg'],
      document: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain'
      ]
    };

    if (exhibit.type in validTypes && !validTypes[exhibit.type].includes(file.type)) {
      setError(`Invalid file type for ${exhibit.type}. Please select a valid file.`);
      e.target.value = '';
      return;
    }

    onUpdate(idx, 'file', file);
  };

  const handleLinkChange = (e) => {
    const newLink = e.target.value;
    setLinkError('');
    
    // Validate URL if not empty
    if (newLink && !isValidUrl(newLink)) {
      setLinkError('Please enter a valid URL (starting with http:// or https://)');
    }
    
    onUpdate(idx, 'link', newLink);
    debouncedUpdate('link', newLink);
  };

  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:border-gray-300 transition-colors">
      <div className="flex gap-3">
        <div className="flex-1 space-y-3">
          <div className="relative">
            <Input
              placeholder="Exhibit Name"
              value={exhibit.name || ''}
              onChange={(e) => {
                const newName = e.target.value;
                onUpdate(idx, 'name', newName);
                debouncedUpdate('name', newName);
              }}
              required
              className="bg-white"
              aria-label={`Exhibit ${idx + 1} name`}
            />
            {isSaving && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-blue-500" />
            )}
            {saveSuccess && (
              <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
            )}
          </div>
          
          <select
            value={exhibit.type || 'link'}
            onChange={(e) => {
              const newType = e.target.value;
              onUpdate(idx, 'type', newType, true);
              if (exhibit.id) {
                experienceService.updateExhibit(exhibit.id, { type: newType }).catch(error => {
                  console.error('Failed to update exhibit type:', error);
                  setError(`Failed to update exhibit type: ${error.message}`);
                });
              }
            }}
            className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={`Exhibit ${idx + 1} type`}
          >
            <option value="link">Link</option>
            <option value="document">Document</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>

          {exhibit.type === 'link' ? (
            <div>
              <Input
                placeholder="https://example.com"
                value={exhibit.link || ''}
                onChange={handleLinkChange}
                type="url"
                className={`bg-white ${linkError ? 'border-red-500' : ''}`}
                aria-label={`Exhibit ${idx + 1} URL`}
                aria-invalid={!!linkError}
              />
              {linkError && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {linkError}
                </p>
              )}
            </div>
          ) : (
            <div>
              <label 
                className="flex items-center justify-center w-full h-9 px-4 border border-input rounded-md bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.target.querySelector('input[type="file"]')?.click();
                  }
                }}
              >
                <Upload className="h-4 w-4 mr-2" />
                <span className="text-sm">
                  {exhibit.file ? exhibit.file.name : `Upload ${exhibit.type}`}
                </span>
                <input
                  type="file"
                  accept={
                    exhibit.type === 'image' ? 'image/*' :
                    exhibit.type === 'video' ? 'video/*' :
                    exhibit.type === 'document' ? '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt' : '*/*'
                  }
                  hidden
                  onChange={handleFileChange}
                  aria-label={`Upload ${exhibit.type} for exhibit ${idx + 1}`}
                />
              </label>
              {exhibit.file && (
                <p className="text-xs text-gray-500 mt-2">
                  Selected: {exhibit.file.name} ({(exhibit.file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>
          )}
        </div>
        <Button
          type="button"
          variant="destructive"
          size="icon"
          onClick={onDelete}
          disabled={!canDelete}
          className="shrink-0"
          aria-label={`Delete exhibit ${exhibit.name || idx + 1}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
});

ExhibitItem.propTypes = {
  exhibit: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
    link: PropTypes.string,
    file: PropTypes.object,
  }).isRequired,
  idx: PropTypes.number.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  canDelete: PropTypes.bool.isRequired,
  experienceService: PropTypes.object.isRequired,
  setError: PropTypes.func.isRequired,
};

// Empty state component
const EmptyState = memo(function EmptyState({ title, description, onAdd, buttonText }) {
  return (
    <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
      <p className="text-sm text-gray-500 mb-4">{description}</p>
      <Button type="button" variant="outline" size="sm" onClick={onAdd}>
        <Plus className="h-4 w-4 mr-2" />
        {buttonText}
      </Button>
    </div>
  );
});

EmptyState.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string.isRequired,
  onAdd: PropTypes.func.isRequired,
  buttonText: PropTypes.string.isRequired,
};

// Main Modal Component
export default function EditExperienceModal({
  open,
  onClose,
  editExperienceData,
  setEditExperienceData,
  validationErrors,
  clearValidationErrors,
  handleAddAgendaStep,
  handleAddExhibit,
  handleSave,
  setError,
  error,
  members,
  selectedExperienceToEdit,
  generateFireteamMeetingLink,
  id,
  fireteam,
  experienceService,
}) {
  const [isAddingStep, setIsAddingStep] = useState(false);
  
  // Handler for agenda step updates (using functional setState to avoid race conditions)
  const handleAgendaUpdate = useCallback((idx, field, value) => {
    setEditExperienceData(prev => ({
      ...prev,
      agenda: prev.agenda.map((item, i) => 
        i === idx ? { ...item, [field]: value } : item
      )
    }));
  }, [setEditExperienceData]);

  // Handler for agenda step deletion
  const handleAgendaDelete = useCallback(async (idx, step) => {
    console.log("Attempting to delete agenda step:", step);
    console.log("Step ID:", step.id);
    
    if (step.id) {
      try {
        console.log("Calling delete API for step ID:", step.id);
        await experienceService.deleteAgendaStep(step.id);
        console.log("Successfully deleted step from API");
      } catch (error) {
        console.error('Failed to delete agenda step:', error);
        console.error('Error response:', error.response?.data);
        setError(`Failed to delete agenda step: ${error.response?.data?.message || error.message}`);
        return;
      }
    } else {
      console.log("Step has no ID, only removing from local state");
    }
    
    setEditExperienceData(prev => ({
      ...prev,
      agenda: prev.agenda.filter((_, i) => i !== idx)
    }));
    console.log("Updated agenda after deletion");
  }, [setEditExperienceData, experienceService, setError]);

  // Handler for exhibit updates (using functional setState to avoid race conditions)
  const handleExhibitUpdate = useCallback((idx, field, value, shouldResetFields = false) => {
    setEditExperienceData(prev => ({
      ...prev,
      exhibits: prev.exhibits.map((item, i) => {
        if (i !== idx) return item;
        
        if (shouldResetFields && field === 'type') {
          // When changing type, reset file and link
          return {
            ...item,
            type: value,
            file: null,
            link: value === 'link' ? item.link : ''
          };
        }
        return { ...item, [field]: value };
      })
    }));
  }, [setEditExperienceData]);

  // Handler for exhibit deletion
  const handleExhibitDelete = useCallback(async (idx, exhibit) => {
    if (exhibit.id) {
      try {
        await experienceService.deleteExhibit(exhibit.id);
      } catch (error) {
        console.error('Failed to delete exhibit:', error);
        setError(`Failed to delete exhibit: ${error.message}`);
        return;
      }
    }
    setEditExperienceData(prev => ({
      ...prev,
      exhibits: prev.exhibits.filter((_, i) => i !== idx)
    }));
  }, [setEditExperienceData, experienceService, setError]);

  // Handler for video admin change
  // NOTE: Meeting link is now generated at experience creation and stays persistent
  // Changing the facilitator does NOT regenerate the link
  const handleVideoAdminChange = useCallback((adminId) => {
    setEditExperienceData(prev => ({
      ...prev,
      videoAdminId: adminId,
      // Meeting link is NOT changed when facilitator changes
    }));
  }, [setEditExperienceData]);

  // Handler for regenerating meeting link
  // Generates a new meeting link independent of facilitator
  const handleRegenerateMeetingLink = useCallback(() => {
    const timestamp = Date.now();
    const newLink = generateFireteamMeetingLink(
      id,
      selectedExperienceToEdit?.id || `edit-${timestamp}`,
      'system',  // Generic identifier (not tied to any user)
      fireteam?.title || 'Fireteam Meeting'  // Meeting display name
    );
    setEditExperienceData(prev => ({
      ...prev,
      link: newLink
    }));
  }, [setEditExperienceData, generateFireteamMeetingLink, id, selectedExperienceToEdit, fireteam]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Escape to close
      if (e.key === 'Escape' && open) {
        onClose();
      }
      // Ctrl+S or Cmd+S to save
      if ((e.ctrlKey || e.metaKey) && e.key === 's' && open) {
        e.preventDefault();
        handleSave();
      }
    };

    if (open) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [open, onClose, handleSave]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" aria-describedby="edit-experience-description">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>Edit Experience</DialogTitle>
            {selectedExperienceToEdit && (
              <span className="px-2 py-1 text-xs font-medium text-primary border border-primary rounded-md">
                Live Edit
              </span>
            )}
          </div>
          <p id="edit-experience-description" className="text-sm text-gray-500 mt-2">
            Use Ctrl+S (Cmd+S) to save or Escape to close
          </p>
        </DialogHeader>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium">Error</p>
              <p className="text-sm">{error}</p>
            </div>
            <button
              onClick={() => setError('')}
              className="text-red-700 hover:text-red-900 transition-colors"
              aria-label="Dismiss error"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="space-y-6 py-4">
          {/* Title */}
          <div>
            <label htmlFor="experience-title" className="block text-sm font-medium mb-2">
              Experience Title <span className="text-red-500">*</span>
            </label>
            <Input
              id="experience-title"
              value={editExperienceData.title}
              onChange={(e) => {
                setEditExperienceData(prev => ({ ...prev, title: e.target.value }));
                if (validationErrors.title) clearValidationErrors();
              }}
              placeholder="Enter a descriptive title for this experience"
              className={validationErrors.title ? 'border-red-500' : ''}
              aria-invalid={!!validationErrors.title}
              aria-describedby={validationErrors.title ? "title-error" : undefined}
            />
            {validationErrors.title && (
              <p id="title-error" className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {validationErrors.title}
              </p>
            )}
          </div>

          {/* Experience Content */}
          <div>
            <label htmlFor="experience-content" className="block text-sm font-medium mb-2">
              Experience Content <span className="text-red-500">*</span>
            </label>
            <textarea
              id="experience-content"
              value={editExperienceData.experience}
              onChange={(e) => {
                setEditExperienceData(prev => ({ ...prev, experience: e.target.value }));
                if (validationErrors.experience) clearValidationErrors();
              }}
              rows={4}
              placeholder="Describe the experience content, learning objectives, and what participants will gain"
              className={`flex w-full rounded-md border px-3 py-2 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
                validationErrors.experience ? 'border-red-500' : 'border-input bg-transparent'
              }`}
              aria-invalid={!!validationErrors.experience}
              aria-describedby={validationErrors.experience ? "content-error" : "content-hint"}
            />
            {validationErrors.experience ? (
              <p id="content-error" className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {validationErrors.experience}
              </p>
            ) : (
              <p id="content-hint" className="text-xs text-gray-500 mt-1">
                Provide detailed content and description of the experience
              </p>
            )}
          </div>

          {/* Agenda Steps */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-heading">Agenda Steps</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={async () => {
                  if (!selectedExperienceToEdit) return;
                  setIsAddingStep(true);
                  try {
                    console.log('🔄 [MODAL] User clicked Add Step button');
                    await handleAddAgendaStep({});
                    console.log('✅ [MODAL] Agenda step added successfully');
                  } catch (error) {
                    console.error('❌ [MODAL] Failed to add agenda step:', error);
                    setError(`Failed to add agenda step: ${error.message}`);
                  } finally {
                    setIsAddingStep(false);
                  }
                }}
                disabled={isAddingStep}
                aria-label={isAddingStep ? "Adding step..." : "Add new agenda step"}
              >
                {isAddingStep ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Step
                  </>
                )}
              </Button>
            </div>
            {validationErrors.agenda && (
              <p className="text-xs text-red-500 mb-2 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {validationErrors.agenda}
              </p>
            )}
            {editExperienceData.agenda?.length > 0 ? (
              <div className="space-y-3" role="list" aria-label="Agenda steps">
                {editExperienceData.agenda.map((step, idx) => (
                  <AgendaStepItem
                    key={step.id || idx}
                    step={step}
                    idx={idx}
                    onUpdate={handleAgendaUpdate}
                    onDelete={() => handleAgendaDelete(idx, step)}
                    canDelete={true}
                    experienceService={experienceService}
                    setError={setError}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                <p className="text-sm text-gray-500 mb-4">No agenda steps added yet.</p>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={async () => {
                    if (!selectedExperienceToEdit) return;
                    setIsAddingStep(true);
                    try {
                      console.log('🔄 [MODAL] User clicked Add First Step button');
                      await handleAddAgendaStep({});
                      console.log('✅ [MODAL] First agenda step added successfully');
                    } catch (error) {
                      console.error('❌ [MODAL] Failed to add agenda step:', error);
                      setError(`Failed to add agenda step: ${error.message}`);
                    } finally {
                      setIsAddingStep(false);
                    }
                  }}
                  disabled={isAddingStep}
                >
                  {isAddingStep ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Step
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Exhibits */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-heading">Exhibits</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddExhibit}
                aria-label="Add new exhibit"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Exhibit
              </Button>
            </div>
            {validationErrors.exhibits && (
              <p className="text-xs text-red-500 mb-2 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {validationErrors.exhibits}
              </p>
            )}
            {editExperienceData.exhibits?.length > 0 ? (
              <div className="space-y-3" role="list" aria-label="Exhibits">
                {editExperienceData.exhibits.map((exhibit, idx) => (
                  <ExhibitItem
                    key={exhibit.id || idx}
                    exhibit={exhibit}
                    idx={idx}
                    onUpdate={handleExhibitUpdate}
                    onDelete={() => handleExhibitDelete(idx, exhibit)}
                    canDelete={true}
                    experienceService={experienceService}
                    setError={setError}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                description="No exhibits added yet."
                buttonText="Add First Exhibit"
                onAdd={handleAddExhibit}
              />
            )}
          </div>

          {/* Experience Video Admin */}
          <div>
            <label htmlFor="video-admin" className="block text-sm font-medium mb-2">
              Experience Video Admin
            </label>
            <select
              id="video-admin"
              value={editExperienceData.videoAdminId || ''}
              onChange={(e) => handleVideoAdminChange(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Select video admin for this experience"
            >
              <option value="">Select a video admin</option>
              {members.map(member => (
                <option key={member.id} value={member.id}>
                  {member.client?.user?.name || member.name || member.id}
                </option>
              ))}
            </select>
          </div>

          {/* Meeting Link */}
          <div>
            <label htmlFor="link" className="block text-sm font-medium mb-2">
              Meeting Link
              <span className="text-xs text-gray-500 ml-2">(Generated automatically at creation)</span>
            </label>
            <div className="flex gap-2">
              <Input
                id="link"
                value={editExperienceData.link || ''}
                onChange={(e) => setEditExperienceData(prev => ({ ...prev, link: e.target.value }))}
                className="flex-1"
                placeholder="https://meet.example.com/..."
                aria-label="Meeting link"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleRegenerateMeetingLink}
                title="Regenerate meeting link"
                aria-label="Regenerate meeting link"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1" id="link-hint">
              Meeting link is auto-generated when the experience is created. Click the refresh button to generate a new link.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleSave}
            aria-label="Save all changes to this experience"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// PropTypes for main component
EditExperienceModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  editExperienceData: PropTypes.shape({
    title: PropTypes.string,
    experience: PropTypes.string,
    agenda: PropTypes.arrayOf(PropTypes.object),
    exhibits: PropTypes.arrayOf(PropTypes.object),
    videoAdminId: PropTypes.string,
    link: PropTypes.string,
  }).isRequired,
  setEditExperienceData: PropTypes.func.isRequired,
  validationErrors: PropTypes.object.isRequired,
  clearValidationErrors: PropTypes.func.isRequired,
  handleAddAgendaStep: PropTypes.func.isRequired,
  handleAddExhibit: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
  error: PropTypes.string,
  members: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedExperienceToEdit: PropTypes.object,
  generateFireteamMeetingLink: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  fireteam: PropTypes.object,
  experienceService: PropTypes.object.isRequired,
};
