import { render, fireEvent } from '@testing-library/react';

import { NotesSection } from '@/components';
import { useMainStore } from '@/stores';

jest.mock('@/stores/main-store', () => ({
  useMainStore: jest.fn()
}));

describe('NotesSection', () => {
  const mockDeleteNote = jest.fn();
  const mockSaveNote = jest.fn();

  beforeEach(() => {
    (useMainStore as unknown as jest.Mock).mockReturnValue({
      deleteNote: mockDeleteNote,
      saveNote: mockSaveNote,
      notes: []
    });
  });

  it('renders the NotesSection with no existing note', () => {
    const { getByText } = render(<NotesSection cityId="test-city-id" />);

    expect(getByText('Notes')).toBeInTheDocument();

    expect(
      getByText('No notes yet. Click on the "Add Note" button to create one.')
    ).toBeInTheDocument();

    expect(getByText('Add Note')).toBeInTheDocument();
  });

  it('enables editing mode when "Add Note" is clicked', () => {
    const { getByPlaceholderText, getByText } = render(
      <NotesSection cityId="test-city-id" />
    );

    fireEvent.click(getByText('Add Note'));

    expect(getByText('Cancel')).toBeInTheDocument();
    expect(getByText('Save')).toBeInTheDocument();

    expect(
      getByPlaceholderText('Write your notes here...')
    ).toBeInTheDocument();
  });

  it('saves a new note when "Save" is clicked', () => {
    const { getByPlaceholderText, getByText } = render(
      <NotesSection cityId="test-city-id" />
    );

    fireEvent.click(getByText('Add Note'));

    fireEvent.change(getByPlaceholderText('Write your notes here...'), {
      target: { value: 'This is a new note.' }
    });

    fireEvent.click(getByText('Save'));

    expect(mockSaveNote).toHaveBeenCalledWith({
      lastEdited: expect.any(String),
      content: 'This is a new note.',
      cityId: 'test-city-id'
    });
  });

  it('renders an existing note and enables editing mode when "Edit" is clicked', () => {
    const mockNote = {
      lastEdited: new Date().toISOString(),
      content: 'This is an existing note.',
      cityId: 'test-city-id'
    };

    (useMainStore as unknown as jest.Mock).mockReturnValue({
      deleteNote: mockDeleteNote,
      saveNote: mockSaveNote,
      notes: [mockNote]
    });

    const { getByPlaceholderText, getByText } = render(
      <NotesSection cityId="test-city-id" />
    );

    expect(getByText('This is an existing note.')).toBeInTheDocument();
    expect(getByText('Delete')).toBeInTheDocument();
    expect(getByText('Edit')).toBeInTheDocument();

    fireEvent.click(getByText('Edit'));

    expect(
      getByPlaceholderText('Write your notes here...')
    ).toBeInTheDocument();

    expect(getByText('Cancel')).toBeInTheDocument();
    expect(getByText('Save')).toBeInTheDocument();
  });

  it('deletes an existing note when "Delete" is clicked', () => {
    const mockNote = {
      lastEdited: new Date().toISOString(),
      content: 'This is an existing note.',
      cityId: 'test-city-id'
    };

    (useMainStore as unknown as jest.Mock).mockReturnValue({
      deleteNote: mockDeleteNote,
      saveNote: mockSaveNote,
      notes: [mockNote]
    });

    window.confirm = jest.fn(() => true);

    const { getByText } = render(<NotesSection cityId="test-city-id" />);

    fireEvent.click(getByText('Delete'));

    expect(window.confirm).toHaveBeenCalledWith(
      'Are you sure you want to delete this note?'
    );

    expect(mockDeleteNote).toHaveBeenCalledWith('test-city-id');
  });

  it('cancels editing mode without saving changes', () => {
    const mockNote = {
      lastEdited: new Date().toISOString(),
      content: 'This is an existing note.',
      cityId: 'test-city-id'
    };

    (useMainStore as unknown as jest.Mock).mockReturnValue({
      deleteNote: mockDeleteNote,
      saveNote: mockSaveNote,
      notes: [mockNote]
    });

    const { getByPlaceholderText, getByText } = render(
      <NotesSection cityId="test-city-id" />
    );

    fireEvent.click(getByText('Edit'));

    fireEvent.change(getByPlaceholderText('Write your notes here...'), {
      target: { value: 'This is an edited note.' }
    });

    fireEvent.click(getByText('Cancel'));

    expect(getByText('This is an existing note.')).toBeInTheDocument();
    expect(mockSaveNote).not.toHaveBeenCalled();
  });
});
