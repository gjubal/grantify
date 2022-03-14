import { useState } from 'react';

const Accordion: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="bg-white">
        <button type="button" onClick={() => setOpen(!open)}>
          +
        </button>
      </div>

      {open && (
        <div className="bg-gray-400 transition duration-300 ease-in-out">
          <h1>Dropdown</h1>
        </div>
      )}
    </>
  );
};

export default Accordion;
