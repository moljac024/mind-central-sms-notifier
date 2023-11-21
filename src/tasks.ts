import BackgroundFetch from 'react-native-background-fetch';
import {z} from 'zod';

export const schema = z.object({
  data: z.array(
    z.object({
      phoneNumber: z.string(),
      therapist: z.string(),
      time: z.string(),
    }),
  ),
});

import {SmsModule} from './modules/native';

export function generateReminderText(
  number: string,
  time: string,
  therapist: string,
) {
  // return `Postovani/postovana, potvrdjujemo vas sutrasnji termin u ${time}.\nVas lekar ce biti ${therapist}`;
  return `Poštovani/poštovana,
Potvrđujemo vaš sutrašnji termin u ${time}.
Vaš lekar će biti ${therapist}.

Srdačan pozdrav,
Ordinacija Psihocentrala`;
}

export async function sendPendingAppointmentReminders() {
  const response = await fetch(
    'https://mind-central-appointments.fly.dev/api/appointments/reminders',
  );
  const json = await response.json();
  const parsed = schema.parse(json);

  for (const entry of parsed.data) {
    const {phoneNumber, time, therapist} = entry;

    const message = generateReminderText(phoneNumber, time, therapist);

    console.log('sending SMS', {message, phoneNumber, chars: message.length});
    const result = await SmsModule.sendSms(phoneNumber, message);
    console.log('SMS Sending result: ', result);
    await sleep(200);
  }
}

// Function that takes in a number and returns a promise that resolves after the
// given ms
export async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function initBackgroundTask() {
  // BackgroundFetch event handler.
  async function onEvent(taskId: string) {
    console.log('[BackgroundFetch] task: ', taskId);
    // Do your background work...
    // IMPORTANT:  You must signal to the OS that your task is complete.

    // Send random amount of messages
    await sendPendingAppointmentReminders();

    BackgroundFetch.finish(taskId);
  }

  // Timeout callback is executed when your Task has exceeded its allowed running-time.
  // You must stop what you're doing immediately BackgroundFetch.finish(taskId)
  async function onTimeout(taskId: string) {
    console.warn('[BackgroundFetch] TIMEOUT task: ', taskId);
    BackgroundFetch.finish(taskId);
  }

  // Initialize BackgroundFetch only once when component mounts.
  let status = await BackgroundFetch.configure(
    {
      minimumFetchInterval: 15,
      requiredNetworkType: BackgroundFetch.NETWORK_TYPE_NOT_ROAMING,
    },
    onEvent,
    onTimeout,
  );

  console.log('[BackgroundFetch] configure status: ', status);
}
