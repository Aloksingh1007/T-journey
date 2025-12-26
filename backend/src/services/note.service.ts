import prisma from '../utils/prisma';
import { CreateNoteInput } from '../validators/note.validator';

/**
 * Create a new note for a trade
 */
export async function createNote(
  userId: string,
  tradeId: string,
  data: CreateNoteInput
) {
  // Verify trade ownership
  const trade = await prisma.trade.findFirst({
    where: {
      id: tradeId,
      userId,
    },
  });

  if (!trade) {
    return null;
  }

  // Create note
  const note = await prisma.note.create({
    data: {
      tradeId,
      content: data.content,
    },
  });

  return note;
}

/**
 * Delete a note
 */
export async function deleteNote(userId: string, noteId: string) {
  // Find note and verify ownership through trade
  const note = await prisma.note.findUnique({
    where: {
      id: noteId,
    },
    include: {
      trade: true,
    },
  });

  if (!note || note.trade.userId !== userId) {
    return null;
  }

  // Delete note
  await prisma.note.delete({
    where: {
      id: noteId,
    },
  });

  return note;
}
