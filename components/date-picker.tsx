import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type DatePickerProps = {
  placeholder?: string;
  onValueChange: (date?: Date) => void;
  value?: Date;
};

export function DatePicker({
  placeholder,
  onValueChange,
  value,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal"
          data-empty={!value}
          variant="outline"
        >
          <CalendarIcon />
          {value ? format(value, "P") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          className="min-w-70"
          mode="single"
          selected={value}
          onSelect={onValueChange}
        />
      </PopoverContent>
    </Popover>
  );
}
