'use client';

import { useState } from 'react';
import { Person } from '@/lib/types';
import { FileJson } from 'lucide-react';

interface JsonInputProps {
  onSubmit: (people: Person[]) => void;
  isLoading: boolean;
}

const EXAMPLE_JSON = {
  people: [
    {
      name: "Awais",
      email: "awais@example.com",
      zipCode: "90210",
      availability: [
        {
          date: "2025-11-03",
          times: ["9:00 AM - 12:00 PM", "2:00 PM - 4:00 PM"]
        },
        {
          date: "2025-11-04",
          times: ["10:00 AM - 1:00 PM"]
        }
      ]
    },
    {
      name: "Sam",
      email: "sam@example.com",
      zipCode: "90211",
      availability: [
        {
          date: "2025-11-03",
          times: ["10:00 AM - 1:00 PM"]
        }
      ]
    },
    {
      name: "Rohan",
      email: "rohan@example.com",
      zipCode: "90212",
      availability: [
        {
          date: "2025-11-03",
          times: ["9:00 AM - 12:00 PM"]
        },
        {
          date: "2025-11-05",
          times: ["2:00 PM - 5:00 PM"]
        }
      ]
    }
  ]
};

export default function JsonInput({ onSubmit, isLoading }: JsonInputProps) {
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const parsed = JSON.parse(jsonText);

      if (!parsed.people || !Array.isArray(parsed.people)) {
        throw new Error('JSON must contain a "people" array');
      }

      if (parsed.people.length !== 3) {
        throw new Error('Exactly 3 people are required');
      }

      for (const person of parsed.people) {
        if (!person.name || !person.email || !person.zipCode) {
          throw new Error('Each person must have name, email, and zipCode');
        }
        if (!person.availability || !Array.isArray(person.availability)) {
          throw new Error('Each person must have an availability array');
        }
      }

      onSubmit(parsed.people);
    } catch (err: any) {
      setError(err.message || 'Invalid JSON format');
    }
  };

  const loadExample = () => {
    setJsonText(JSON.stringify(EXAMPLE_JSON, null, 2));
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-white rounded-xl shadow-md border border-purple-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileJson className="w-5 h-5 text-purple-800" />
            <h3 className="text-lg font-semibold text-purple-900">
              Paste JSON Data
            </h3>
          </div>
          <button
            type="button"
            onClick={loadExample}
            className="text-sm text-purple-800 hover:text-purple-900 underline"
          >
            Load Example
          </button>
        </div>

        <textarea
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          className="w-full h-96 px-4 py-3 font-mono text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          placeholder='Paste your JSON here or click "Load Example"'
        />

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <h4 className="font-semibold text-purple-900 text-sm mb-2">Expected Format:</h4>
          <pre className="text-xs text-gray-700 overflow-x-auto">
{`{
  "people": [
    {
      "name": "John",
      "email": "john@example.com",
      "zipCode": "90210",
      "availability": [
        {
          "date": "2025-11-03",
          "times": ["9:00 AM - 12:00 PM"]
        }
      ]
    },
    // ... 2 more people
  ]
}`}
          </pre>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          type="submit"
          disabled={isLoading || !jsonText}
          className="px-8 py-3 bg-purple-800 text-white font-semibold rounded-lg shadow-lg hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Analyzing...' : 'Find Meeting'}
        </button>
      </div>
    </form>
  );
}
