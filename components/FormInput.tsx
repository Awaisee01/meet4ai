"use client";

import { useState } from "react";
import { Person } from "@/lib/types";
import {
  Plus,
  Trash2,
  User,
  Mail,
  MapPin,
  Calendar,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormInputProps {
  onSubmit: (people: Person[]) => void;
  isLoading: boolean;
}

interface PersonForm {
  name: string;
  email: string;
  zipCode: string;
  availability: Array<{
    date: string;
    times: string[];
  }>;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const TIME_SLOTS = [
  "9:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "12:00 PM - 1:00 PM",
  "1:00 PM - 2:00 PM",
  "2:00 PM - 3:00 PM",
  "3:00 PM - 4:00 PM",
  "4:00 PM - 5:00 PM",
  "5:00 PM - 6:00 PM",
];

const getNextWeekDates = () => {
  const dates: { label: string; value: string }[] = [];
  const today = new Date();
  const currentDay = today.getDay();

  const daysUntilMonday =
    currentDay === 0 ? 1 : currentDay === 1 ? 0 : 8 - currentDay;
  const nextMonday = new Date(today);
  nextMonday.setDate(today.getDate() + daysUntilMonday);

  for (let i = 0; i < 5; i++) {
    const date = new Date(nextMonday);
    date.setDate(nextMonday.getDate() + i);
    const dateStr = date.toISOString().split("T")[0];
    dates.push({
      label: DAYS[i],
      value: dateStr,
    });
  }

  return dates;
};

export default function FormInput({ onSubmit, isLoading }: FormInputProps) {
  const weekDates = getNextWeekDates();

  const [people, setPeople] = useState<PersonForm[]>([
    { name: "", email: "", zipCode: "", availability: [] },
    { name: "", email: "", zipCode: "", availability: [] },
    { name: "", email: "", zipCode: "", availability: [] },
  ]);

  const updatePerson = (index: number, field: keyof PersonForm, value: any) => {
    const updated = [...people];
    updated[index] = { ...updated[index], [field]: value };
    setPeople(updated);
  };

  const addTimeSlot = (personIndex: number, date: string, time: string) => {
    if (!time) return;

    const updated = [...people];
    const person = updated[personIndex];
    const existingSlot = person.availability.find((slot) => slot.date === date);

    if (existingSlot) {
      if (!existingSlot.times.includes(time)) {
        existingSlot.times.push(time);
      }
    } else {
      person.availability.push({ date, times: [time] });
    }

    setPeople(updated);
  };

  const removeTimeSlot = (personIndex: number, date: string, time: string) => {
    const updated = [...people];
    const person = updated[personIndex];
    const slotIndex = person.availability.findIndex(
      (slot) => slot.date === date
    );

    if (slotIndex !== -1) {
      const slot = person.availability[slotIndex];
      slot.times = slot.times.filter((t) => t !== time);

      if (slot.times.length === 0) {
        person.availability.splice(slotIndex, 1);
      }
    }

    setPeople(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validPeople = people.every(
      (p) => p.name && p.email && p.zipCode && p.availability.length > 0
    );

    if (!validPeople) {
      alert(
        "Please fill in all fields and add at least one time slot for each person"
      );
      return;
    }

    onSubmit(people as Person[]);
  };

  const renderPersonForm = (person: PersonForm, personIndex: number) => (
    <div className="space-y-6">
      {/* Personal Info Section */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label
            htmlFor={`name-${personIndex}`}
            className="flex items-center gap-2 text-sm font-medium"
          >
            <User className="w-4 h-4 text-muted-foreground" />
            Name
          </Label>
          <Input
            id={`name-${personIndex}`}
            type="text"
            value={person.name}
            onChange={(e) => updatePerson(personIndex, "name", e.target.value)}
            placeholder="Enter full name"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor={`email-${personIndex}`}
              className="flex items-center gap-2 text-sm font-medium"
            >
              <Mail className="w-4 h-4 text-muted-foreground" />
              Email
            </Label>
            <Input
              id={`email-${personIndex}`}
              type="email"
              value={person.email}
              onChange={(e) =>
                updatePerson(personIndex, "email", e.target.value)
              }
              placeholder="email@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor={`zip-${personIndex}`}
              className="flex items-center gap-2 text-sm font-medium"
            >
              <MapPin className="w-4 h-4 text-muted-foreground" />
              Zip Code
            </Label>
            <Input
              id={`zip-${personIndex}`}
              type="text"
              value={person.zipCode}
              onChange={(e) =>
                updatePerson(personIndex, "zipCode", e.target.value)
              }
              placeholder="90210"
              required
            />
          </div>
        </div>
      </div>

      {/* Availability Section */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          Availability (Next Week)
        </Label>

        <div className="space-y-2">
          {weekDates.map((day) => {
            const existingSlot = person.availability.find(
              (slot) => slot.date === day.value
            );

            return (
              <Card key={day.value} className="border-muted">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium text-sm">{day.label}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {day.value}
                      </span>
                    </div>

                    <Select
                      onValueChange={(value) => {
                        addTimeSlot(personIndex, day.value, value);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Add time slot..." />
                      </SelectTrigger>
                      <SelectContent>
                        {TIME_SLOTS.map((slot) => (
                          <SelectItem key={slot} value={slot}>
                            {slot}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {existingSlot && existingSlot.times.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {existingSlot.times.map((time, timeIndex) => (
                          <Badge
                            key={timeIndex}
                            variant="secondary"
                            className="px-3 py-1 gap-1"
                          >
                            {time}
                            <button
                              type="button"
                              onClick={() =>
                                removeTimeSlot(personIndex, day.value, time)
                              }
                              className="ml-1 hover:text-destructive transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-4xl mx-auto space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Meeting Participants</CardTitle>
          <CardDescription>
            Enter information for all three participants to find the best
            meeting time
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Desktop View - All three cards visible */}
          <div className="hidden md:block space-y-6">
            {people.map((person, personIndex) => (
              <Card key={personIndex} className="border-2">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">
                        {personIndex + 1}
                      </span>
                    </div>
                    Person {personIndex + 1}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {renderPersonForm(person, personIndex)}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Mobile View - Tabbed interface */}
          <div className="md:hidden">
            <Tabs defaultValue="0" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="0">Person 1</TabsTrigger>
                <TabsTrigger value="1">Person 2</TabsTrigger>
                <TabsTrigger value="2">Person 3</TabsTrigger>
              </TabsList>
              {people.map((person, personIndex) => (
                <TabsContent
                  key={personIndex}
                  value={String(personIndex)}
                  className="mt-6"
                >
                  {renderPersonForm(person, personIndex)}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button
          type="submit"
          disabled={isLoading}
          className="px-8 py-3 bg-purple-800 text-white font-semibold rounded-lg shadow-lg hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          size="lg"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
              Analyzing...
            </>
          ) : (
            "Find Meeting Time"
          )}
        </Button>
      </div>
    </form>
  );
}
