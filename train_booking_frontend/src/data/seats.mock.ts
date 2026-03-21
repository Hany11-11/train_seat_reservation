import { Coach, Seat, SeatStatus } from '@/types/seat';

export const mockCoaches: Coach[] = [
  // Train 1 coaches
  { id: 'c1-1', trainId: 't1', name: 'A1', classType: '1ST', totalSeats: 24, seatsPerRow: 4, totalRows: 6, layout: '2-2' },
  { id: 'c1-2', trainId: 't1', name: 'B1', classType: '2ND', totalSeats: 48, seatsPerRow: 4, totalRows: 12, layout: '2-2' },
  { id: 'c1-3', trainId: 't1', name: 'B2', classType: '2ND', totalSeats: 48, seatsPerRow: 4, totalRows: 12, layout: '2-2' },
  { id: 'c1-4', trainId: 't1', name: 'C1', classType: '3RD', totalSeats: 72, seatsPerRow: 6, totalRows: 12, layout: '3-3' },
  
  // Train 2 coaches
  { id: 'c2-1', trainId: 't2', name: 'A1', classType: '1ST', totalSeats: 24, seatsPerRow: 4, totalRows: 6, layout: '2-2' },
  { id: 'c2-2', trainId: 't2', name: 'B1', classType: '2ND', totalSeats: 48, seatsPerRow: 4, totalRows: 12, layout: '2-2' },
  { id: 'c2-3', trainId: 't2', name: 'C1', classType: '3RD', totalSeats: 72, seatsPerRow: 6, totalRows: 12, layout: '3-3' },
  
  // Train 3 coaches
  { id: 'c3-1', trainId: 't3', name: 'A1', classType: '1ST', totalSeats: 24, seatsPerRow: 4, totalRows: 6, layout: '2-2' },
  { id: 'c3-2', trainId: 't3', name: 'A2', classType: '1ST', totalSeats: 24, seatsPerRow: 4, totalRows: 6, layout: '2-2' },
  { id: 'c3-3', trainId: 't3', name: 'B1', classType: '2ND', totalSeats: 48, seatsPerRow: 4, totalRows: 12, layout: '2-2' },
  { id: 'c3-4', trainId: 't3', name: 'C1', classType: '3RD', totalSeats: 72, seatsPerRow: 6, totalRows: 12, layout: '3-3' },
  
  // Train 4 coaches
  { id: 'c4-1', trainId: 't4', name: 'A1', classType: '1ST', totalSeats: 24, seatsPerRow: 4, totalRows: 6, layout: '2-2' },
  { id: 'c4-2', trainId: 't4', name: 'B1', classType: '2ND', totalSeats: 48, seatsPerRow: 4, totalRows: 12, layout: '2-2' },
  { id: 'c4-3', trainId: 't4', name: 'C1', classType: '3RD', totalSeats: 72, seatsPerRow: 6, totalRows: 12, layout: '3-3' },
  
  // Train 5 coaches
  { id: 'c5-1', trainId: 't5', name: 'A1', classType: '1ST', totalSeats: 24, seatsPerRow: 4, totalRows: 6, layout: '2-2' },
  { id: 'c5-2', trainId: 't5', name: 'B1', classType: '2ND', totalSeats: 48, seatsPerRow: 4, totalRows: 12, layout: '2-2' },
  { id: 'c5-3', trainId: 't5', name: 'C1', classType: '3RD', totalSeats: 72, seatsPerRow: 6, totalRows: 12, layout: '3-3' },
];

export const generateSeatsForCoach = (coach: Coach, scheduleId: string, date: string): Seat[] => {
  const seats: Seat[] = [];
  const storageKey = `seats_${scheduleId}_${date}_${coach.id}`;
  const stored = localStorage.getItem(storageKey);
  
  if (stored) {
    return JSON.parse(stored);
  }
  
  let seatCounter = 1;
  for (let row = 1; row <= coach.totalRows; row++) {
    for (let col = 1; col <= coach.seatsPerRow; col++) {
      const randomStatus = Math.random();
      let status: SeatStatus = 'available';
      if (randomStatus < 0.2) {
        status = 'booked';
      } else if (randomStatus < 0.25) {
        status = 'unavailable';
      }
      
      seats.push({
        id: `${coach.id}_${row}_${col}`,
        coachId: coach.id,
        seatNumber: `${seatCounter}`,
        row,
        column: col,
        status,
        classType: coach.classType,
      });
      seatCounter++;
    }
  }
  
  localStorage.setItem(storageKey, JSON.stringify(seats));
  return seats;
};

export const getCoachesForTrain = (trainId: string): Coach[] => {
  const stored = localStorage.getItem('coaches');
  if (stored) {
    const coaches: Coach[] = JSON.parse(stored);
    return coaches.filter(c => c.trainId === trainId);
  }
  localStorage.setItem('coaches', JSON.stringify(mockCoaches));
  return mockCoaches.filter(c => c.trainId === trainId);
};

export const getAllCoaches = (): Coach[] => {
  const stored = localStorage.getItem('coaches');
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem('coaches', JSON.stringify(mockCoaches));
  return mockCoaches;
};

export const saveCoachesToStorage = (coaches: Coach[]): void => {
  localStorage.setItem('coaches', JSON.stringify(coaches));
};

export const updateSeatStatus = (
  scheduleId: string,
  date: string,
  coachId: string,
  seatIds: string[],
  newStatus: SeatStatus
): void => {
  const storageKey = `seats_${scheduleId}_${date}_${coachId}`;
  const stored = localStorage.getItem(storageKey);
  if (stored) {
    const seats: Seat[] = JSON.parse(stored);
    const updatedSeats = seats.map(seat => 
      seatIds.includes(seat.id) ? { ...seat, status: newStatus } : seat
    );
    localStorage.setItem(storageKey, JSON.stringify(updatedSeats));
  }
};
