import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './Notepad.css'; // Import CSS

const colorThemes = [
  { backgroundColor: '#f7f7f7', textColor: '#333', buttonColor: '#4CAF50', borderColor: '#ccc' },
  { backgroundColor: '#f0f8ff', textColor: '#00008B', buttonColor: '#FF4500', borderColor: '#1E90FF' },
  { backgroundColor: '#FFF5EE', textColor: '#8B4513', buttonColor: '#20B2AA', borderColor: '#B8860B' },
  { backgroundColor: '#F0FFF0', textColor: '#2F4F4F', buttonColor: '#FF6347', borderColor: '#556B2F' },
  { backgroundColor: '#F5F5DC', textColor: '#A52A2A', buttonColor: '#FF69B4', borderColor: '#8A2BE2' },
  { backgroundColor: '#F0E68C', textColor: '#2E8B57', buttonColor: '#6A5ACD', borderColor: '#4682B4' },
  { backgroundColor: '#E6E6FA', textColor: '#191970', buttonColor: '#DA70D6', borderColor: '#9370DB' },
];

function Notepad() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [selectedNote, setSelectedNote] = useState(null);
  const [currentTheme, setCurrentTheme] = useState(colorThemes[0]); // Default theme

  // Load data from localStorage with error handling
  useEffect(() => {
    const storedNotes = loadFromLocalStorage('notes', []);
    const storedTheme = loadFromLocalStorage('currentTheme', colorThemes[0]);
    setNotes(storedNotes);
    setCurrentTheme(storedTheme);
  }, []);

  // Save notes and theme to localStorage
  useEffect(() => {
    saveToLocalStorage('notes', notes);
  }, [notes]);

  useEffect(() => {
    saveToLocalStorage('currentTheme', currentTheme);
  }, [currentTheme]);

  const loadFromLocalStorage = (key, defaultValue) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return defaultValue;
    }
  };

  const saveToLocalStorage = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  const addNote = () => {
    if (newNote.title && newNote.content) { // Ensure title and content are not empty
      setNotes([...notes, { ...newNote, id: Date.now(), createdAt: new Date() }]); // Add createdAt
      setNewNote({ title: '', content: '' }); // Reset the new note input
    }
  };

  const updateNote = () => {
    if (selectedNote) {
      const updatedNotes = notes.map(note =>
        note.id === selectedNote.id ? { ...note, title: selectedNote.title, content: selectedNote.content } : note
      );
      setNotes(updatedNotes);
      setSelectedNote(null); // Clear selected note after update
    }
  };

  const editNote = (note) => {
    setSelectedNote(note); // Set the selected note to edit
  };

  const deleteNote = (noteId) => {
    const updatedNotes = notes.filter(note => note.id !== noteId);
    setNotes(updatedNotes);
    if (selectedNote?.id === noteId) setSelectedNote(null); // Clear selected note if deleted
  };

  return (
    <div className="notepad-container" style={{ backgroundColor: currentTheme.backgroundColor, color: currentTheme.textColor }}>
      <h1>Notepad</h1>

      {/* Theme Selector */}
      <div className="theme-selector">
        {colorThemes.map((theme, index) => (
          <button
            key={index}
            className="theme-button"
            style={{ backgroundColor: theme.buttonColor, borderColor: theme.borderColor }}
            onClick={() => setCurrentTheme(theme)}
          />
        ))}
      </div>

      {/* Note creation section */}
      <div className="note-creation">
        <input
          className="notepad-input"
          type="text"
          placeholder="Title"
          value={newNote.title}
          onChange={e => setNewNote({ ...newNote, title: e.target.value })}
          style={{ borderColor: currentTheme.borderColor }}
        />
        <ReactQuill
          className="notepad-editor"
          value={newNote.content}
          onChange={content => setNewNote({ ...newNote, content })}
        />
        <div className="button-container">
          <button className="notepad-button" style={{ backgroundColor: currentTheme.buttonColor }} onClick={addNote}>
            Create Note
          </button>
        </div>
      </div>

      {/* Notes list displayed as folders */}
      <div className="notes-folder-container">
        {notes.map(note => (
          <div
            key={note.id}
            className="note-folder"
            style={{ borderColor: currentTheme.borderColor }}
          >
            <h3 className="note-folder-title" onClick={() => editNote(note)}>{note.title}</h3>
            <p className="note-created-at">{new Date(note.createdAt).toLocaleDateString()}</p> {/* Display creation date */}
            <button onClick={() => deleteNote(note.id)}>Delete</button>
          </div>
        ))}
      </div>

      {/* Selected note details */}
      {selectedNote && (
        <div className="notepad-editor-wrapper">
          <input
            className="notepad-input"
            type="text"
            value={selectedNote.title}
            onChange={e => setSelectedNote({ ...selectedNote, title: e.target.value })} // Update title directly
            style={{ borderColor: currentTheme.borderColor }}
          />
          <ReactQuill
            className="notepad-editor"
            value={selectedNote.content}
            onChange={content => setSelectedNote({ ...selectedNote, content })} // Update content directly
          />
          <div className="button-container">
            <button className="notepad-button-update" style={{ backgroundColor: currentTheme.buttonColor }} onClick={updateNote}>
              Update Note
            </button>
            <button className="notepad-button-cancel" style={{ backgroundColor: currentTheme.buttonColor }} onClick={() => setSelectedNote(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Notepad;
