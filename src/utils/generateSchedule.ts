import { DaySchedule } from '@/models/availability-schedule.model';
import moment from 'moment';

export default function generateSchedule(availability: string[], slotDuration: string): DaySchedule[] {
    const schedule: DaySchedule[] = [];
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const slotDurationInMinutes = parseInt(slotDuration);

    days.forEach(day => {
        const daySchedule: DaySchedule = {
            day: day,
            slots: [],
        };

        availability.forEach(slot => {
            if (slot.includes(day)) {
                const [start, end] = slot.split(" ")[1].split("-");
                const startTime = moment(start, "h:mmA"); // Parses times like "9AM"
                const endTime = moment(end, "h:mmA");   // Parses times like "11PM"

                if (startTime.isAfter(endTime)) { 
                    // Generate slots from start to midnight
                    let currentTime = moment(startTime);
                    const midnight = moment("11:59PM", "h:mmA");
                    while (currentTime.isBefore(midnight)) {
                        const nextTime = currentTime.clone().add(slotDurationInMinutes, 'minutes');
                        if (nextTime.isSameOrBefore(midnight)) {
                            const formattedSlot = `${currentTime.format('h:mmA')}-${nextTime.format('h:mmA')}`;
                            daySchedule.slots.push(formattedSlot);
                        }else{
                            //handling last casse
                            const formattedSlot = `${currentTime.format('h:mmA')}-${nextTime.format('h:mmA')}`;
                            daySchedule.slots.push(formattedSlot);

                        }
                        currentTime = nextTime;

                    }
                    // Generate slots from midnight to end time
                    currentTime = moment("12:00AM", "h:mmA");
                    while (currentTime.isBefore(endTime)) {
                        const nextTime = currentTime.clone().add(slotDurationInMinutes, 'minutes');
                        if (nextTime.isSameOrBefore(endTime)) {
                            const formattedSlot = `${currentTime.format('h:mmA')}-${nextTime.format('h:mmA')}`;
                            daySchedule.slots.push(formattedSlot);
                        }
                        currentTime = nextTime;
                    }
                } else {
                    // Case: Normal AM-to-AM or PM-to-PM
                    let currentTime = moment(startTime);
                    while (currentTime.isBefore(endTime)) {
                        const nextTime = currentTime.clone().add(slotDurationInMinutes, 'minutes');
                        if (nextTime.isSameOrBefore(endTime)) {
                            const formattedSlot = `${currentTime.format('h:mmA')}-${nextTime.format('h:mmA')}`;
                            daySchedule.slots.push(formattedSlot);
                        } 
                        currentTime = nextTime;
                    }
                }
            }
        });

        schedule.push(daySchedule);
    });
    // console.log(schedule);
    return schedule;
}
