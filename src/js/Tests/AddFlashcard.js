import React, { useState } from 'react';

const AddFlashcard = () => {
  const [term, setTerm] = useState('');
  const [definition, setDefinition] = useState('');
  const [cards, setCards] = useState([]);

  const handleAddFlashcard = async () => {
    if (term && definition) {
      try {
        // Mocked FlashcardRepo.addFlashcardItem will be resolved with a new flashcardId
        const newFlashcardId = await FlashcardRepo.addFlashcardItem(setId, term, definition);

        setCards((prev) => [...prev, { term, definition, flashcardId: newFlashcardId }]);
        setTerm('');
        setDefinition('');
      } catch (error) {
        console.error('Failed to add flashcard:', error);
      }
    }
  };

  return (
    <div>
      <label>
        Term:
        <input type="text" value={term} onChange={(e) => setTerm(e.target.value)} />
      </label>
      <label>
        Definition:
        <input type="text" value={definition} onChange={(e) => setDefinition(e.target.value)} />
      </label>
      <button onClick={handleAddFlashcard}>Add Flashcard</button>

      <div>
        {cards.map((card) => (
          <div key={card.flashcardId}>
            <strong>{card.term}</strong>: {card.definition}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddFlashcard;
