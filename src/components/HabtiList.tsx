import * as CheckBox from "@radix-ui/react-checkbox";
import dayjs from "dayjs";
import { Check } from "phosphor-react";
import { useEffect, useState } from "react";
import { api } from "../lib/axios";

interface HabiListProps {
  date: Date;
  onCompletedChanged: (completed: number) => void;
}

interface Habitsinfo {
  possibleHabits: Array<{
    id: string;
    title: string;
    created_at: string;
  }>;
  completedHabits: string[];
}

export function HabiList({ date, onCompletedChanged }: HabiListProps) {
  const [habistinfo, setHabistinfo] = useState<Habitsinfo>();
  useEffect(() => {
    api
      .get("/day", {
        params: {
          date: date.toISOString(),
        },
      })
      .then((response) => {
        setHabistinfo(response.data);
      });
  });

  async function handleToggleHabit(habitId: string) {
    await api.patch(`/habits/${habitId}/toggle`);

    const isHabitAlreadyCompleted =
      habistinfo!.completedHabits.includes(habitId);
    let completedHabits: string[] = [];

    if (isHabitAlreadyCompleted) {
      completedHabits = habistinfo!.completedHabits.filter(
        (id) => id !== habitId
      );
    } else {
      completedHabits = [...habistinfo!.completedHabits, habitId];
    }
    setHabistinfo({
      possibleHabits: habistinfo!.possibleHabits,
      completedHabits,
    });
    onCompletedChanged(completedHabits.length);
  }

  const isDateInPast = dayjs(date).endOf("day").isBefore(new Date());
  return (
    <div className="mt-6 flex flex-col gap-3 ">
      {habistinfo?.possibleHabits.map((habit) => {
        return (
          <CheckBox.Root
            key={habit.id}
            onCheckedChange={() => handleToggleHabit(habit.id)}
            disabled={isDateInPast}
            checked={habistinfo.completedHabits.includes(habit.id)}
            className="flex items-center gap-3 group  focus:outline-none"
          >
            <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 transition-colors group-focus:ring-2 focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-background">
              <CheckBox.Indicator>
                <Check size={20} className="text-white" />
              </CheckBox.Indicator>
            </div>

            <span className="font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-500 ">
              {habit.title}
            </span>
          </CheckBox.Root>
        );
      })}
    </div>
  );
}
