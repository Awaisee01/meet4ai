# Meet 4.ai

An AI-powered meeting scheduler that helps three people find optimal meeting times and central locations.

## Features

- **Form Mode**: Manual input interface for entering availability
- **JSON Mode**: Paste structured JSON data directly
- **AI-Powered Scheduling**: Uses OpenAI to find up to 3 optimal meeting times
- **Location Intelligence**: Suggests central zip codes within 30 minutes travel time
- **Modern UI**: Clean, purple-themed responsive design
- **Error Handling**: Friendly error messages and validation

## Getting Started

### Prerequisites

- Node.js 18+ installed
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. Clone or download this project

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```bash
cp .env.local.example .env.local
```

4. Add your OpenAI API key to `.env.local`:
```
OPENAI_API_KEY=your_actual_api_key_here
```

### Running the App

Development mode:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm run start
```

## How to Use

### Form Mode

1. Select "Form Mode" at the top
2. Enter details for 3 people:
   - Name
   - Email
   - Zip Code
   - Availability (select days and time slots)
3. Click "Find Meeting"
4. View AI-generated meeting suggestions

### JSON Mode

1. Select "JSON Mode" at the top
2. Click "Load Example" to see the format
3. Paste your JSON data or modify the example
4. Click "Find Meeting"
5. View results

### JSON Format Example

```json
{
  "people": [
    {
      "name": "Rohan",
      "email": "rohan@example.com",
      "zipCode": "90210",
      "availability": [
        {
          "date": "2025-11-03",
          "times": ["9:00 AM - 12:00 PM", "2:00 PM - 4:00 PM"]
        },
        {
          "date": "2025-11-04",
          "times": ["10:00 AM - 1:00 PM"]
        }
      ]
    },
    {
      "name": "Sam",
      "email": "sam@example.com",
      "zipCode": "90211",
      "availability": [
        {
          "date": "2025-11-03",
          "times": ["10:00 AM - 1:00 PM"]
        }
      ]
    },
    {
      "name": "Ali",
      "email": "ali@example.com",
      "zipCode": "90212",
      "availability": [
        {
          "date": "2025-11-03",
          "times": ["9:00 AM - 12:00 PM"]
        }
      ]
    }
  ]
}
```

## Technology Stack

- **Next.js 13** (App Router)
- **TypeScript** (Strict mode)
- **Tailwind CSS** (Styling)
- **OpenAI API** (GPT-4o-mini)
- **Lucide React** (Icons)

## Project Structure

```
├── app/
│   ├── api/
│   │   └── find-meeting/
│   │       └── route.ts          # OpenAI API integration
│   ├── layout.tsx
│   └── page.tsx                  # Main application page
├── components/
│   ├── Header.tsx                # App header
│   ├── ModeToggle.tsx            # Form/JSON mode switcher
│   ├── FormInput.tsx             # Manual entry form
│   ├── JsonInput.tsx             # JSON paste interface
│   ├── ResultsDisplay.tsx        # Meeting suggestions display
│   ├── LoadingState.tsx          # Loading indicator
│   └── ErrorDisplay.tsx          # Error messages
├── lib/
│   └── types.ts                  # TypeScript interfaces
└── README.md
```

## Deployment

Deploy to Vercel:

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add `OPENAI_API_KEY` in Environment Variables
4. Deploy

## Troubleshooting

**Error: "OpenAI API key not configured"**
- Make sure `.env.local` exists with your API key
- Restart the development server after adding the key

**Error: "AI could not find matching times"**
- Ensure all 3 people have overlapping availability
- Check that time slots are properly formatted

**Error: "Invalid JSON format"**
- Validate your JSON using the example format
- Make sure there are exactly 3 people

## License

MIT
