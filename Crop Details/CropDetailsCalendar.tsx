"use client";

import React, { useState, useMemo } from "react";
import { InteractiveCalendar } from "../Crop Monitoring page/components/InteractiveCalendar";
import { SelectedDatePanel } from "../Crop Monitoring page/components/SelectedDatePanel";
import { AddActivityModal } from "../Crop Monitoring page/components/AddActivityModal";
import { AiAgronomistDrawer } from "../Crop Monitoring page/components/AiAgronomistDrawer";
import { INITIAL_CROPS, WEATHER_FORECAST } from "../Crop Monitoring page/mockData";
import { RegisteredCrop, Activity } from "../Crop Monitoring page/types";

// Helper to map Crop Details basic IDs to our mock data full crops
const getMockCrop = (cropId: string): RegisteredCrop => {
  if (cropId === 'paddy') return INITIAL_CROPS.find(c => c.id === 'crop-paddy-01') || INITIAL_CROPS[0];
  if (cropId === 'mustard') return INITIAL_CROPS.find(c => c.id === 'crop-mustard-02') || INITIAL_CROPS[0];
  // Fallback to wheat for maize or any other since maize is not in INITIAL_CROPS
  return INITIAL_CROPS.find(c => c.id === 'crop-wheat-03') || INITIAL_CROPS[0];
};

const todayIST = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
const todayStr = `${todayIST.getFullYear()}-${String(todayIST.getMonth() + 1).padStart(2, "0")}-${String(todayIST.getDate()).padStart(2, "0")}`;

interface CropDetailsCalendarProps {
  cropId: string;
}

export default function CropDetailsCalendar({ cropId }: CropDetailsCalendarProps) {
  const initialCrop = getMockCrop(cropId);
  const [currentCrop, setCurrentCrop] = useState<RegisteredCrop>(initialCrop);
  
  // Reset crop if the cropId prop changes
  useMemo(() => {
    setCurrentCrop(getMockCrop(cropId));
  }, [cropId]);

  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(todayIST);
  const [filterType, setFilterType] = useState<string>("all");
  const [isAddActivityModalOpen, setIsAddActivityModalOpen] = useState<boolean>(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState<boolean>(false);
  const [aiPromptPrefill, setAiPromptPrefill] = useState<string>("");

  // We use static mock weather since useWeather hook is for Crop Monitoring
  const weatherForecast = WEATHER_FORECAST;

  const handleToggleActivity = (activityId: string) => {
    setCurrentCrop((prevCrop) => {
      const updatedActivities = prevCrop.activities.map((act) => {
        if (act.id !== activityId) return act;
        const isNowCompleted = act.status !== "completed";
        return {
          ...act,
          status: isNowCompleted ? ("completed" as const) : ("pending" as const),
          completedAt: isNowCompleted
            ? new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : undefined,
        };
      });
      return { ...prevCrop, activities: updatedActivities };
    });
  };

  const handleAddActivity = (newAct: Activity) => {
    setCurrentCrop((prevCrop) => ({
      ...prevCrop,
      activities: [...prevCrop.activities, newAct]
    }));
  };

  const handleOpenAiWithPrompt = (prompt: string) => {
    setAiPromptPrefill(prompt);
    setIsAiDrawerOpen(true);
  };

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <InteractiveCalendar
            currentCrop={currentCrop}
            selectedDate={selectedDate}
            onSelectDate={(date) => setSelectedDate(date)}
            currentMonthDate={currentMonthDate}
            onChangeMonth={(newDate) => setCurrentMonthDate(newDate)}
            filterType={filterType}
            onFilterChange={(newFilter) => setFilterType(newFilter)}
            weatherForecast={weatherForecast}
          />
        </div>
        <div className="lg:col-span-5 space-y-4">
          <SelectedDatePanel
            currentCrop={currentCrop}
            selectedDate={selectedDate}
            weatherForecast={weatherForecast}
            onToggleActivity={handleToggleActivity}
            onOpenAddModalForDate={(date) => {
              setSelectedDate(date);
              setIsAddActivityModalOpen(true);
            }}
            onOpenAiWithPrompt={handleOpenAiWithPrompt}
          />
        </div>
      </section>

      <AddActivityModal
        cropId={currentCrop.id}
        defaultDate={selectedDate}
        isOpen={isAddActivityModalOpen}
        onClose={() => setIsAddActivityModalOpen(false)}
        onAddActivity={handleAddActivity}
      />

      <AiAgronomistDrawer
        currentCrop={currentCrop}
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
        prefilledPrompt={aiPromptPrefill}
      />
    </div>
  );
}
