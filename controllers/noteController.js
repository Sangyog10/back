import noteModel from "../model/noteModel.js";
import userModel from "../model/userModel.js";

const createNote = async (req, res) => {
  const { title, content } = req.body;
  const { userId } = req.user;

  try {
    const newNote = new noteModel({
      title,
      content,
      createdBy: userId,
    });

    await newNote.save();
    await userModel.findByIdAndUpdate(userId, {
      $push: { notes: newNote._id },
    });
    res.status(201).json({
      msg: "Note created successfully",
      note: newNote,
    });
  } catch (err) {
    res.status(500).json({ msg: "Error creating note", error: err.message });
  }
};

const getNotes = async (req, res) => {
  const { userId } = req.user;
  try {
    const userNotes = await noteModel.find({ createdBy: userId });
    res.status(200).json(userNotes);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching notes", error: err.message });
  }
};

const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const { title, content } = req.body;

  try {
    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      { title, content, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ msg: "Note not found" });
    }

    res.status(200).json({
      msg: "Note updated successfully",
      note: updatedNote,
    });
  } catch (err) {
    res.status(500).json({ msg: "Error updating note", error: err.message });
  }
};

const deleteNote = async (req, res) => {
  const { noteId } = req.params;

  try {
    const deletedNote = await Note.findByIdAndDelete(noteId);
    if (!deletedNote) {
      return res.status(404).json({ msg: "Note not found" });
    }

    res.status(200).json({
      msg: "Note deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting note", error: err.message });
  }
};

export { createNote, updateNote, deleteNote, getNotes };
