import BackgroundFetch from 'react-native-background-fetch';
import {z} from 'zod';

import {sleep} from '../lib/time';
import {DB} from './db';

export async function fetchPendingAppointmentReminders() {
  const schema = z.object({
    data: z.array(
      z.object({
        phoneNumber: z.string(),
        therapist: z.string(),
        time: z.string(),
      }),
    ),
  });

  const response = await fetch(
    'https://mind-central-appointments.fly.dev/api/appointments/reminders?delay=8000',
  );
  const json = await response.json();
  const parsed = schema.parse(json);

  return parsed.data;
}

// import {SmsModule} from './modules/native';

export function generateReminderText(time: string, therapist: string) {
  return `Poštovani/poštovana,
Potvrđujemo vaš sutrašnji termin u ${time}.
Vaš lekar će biti ${therapist}.

Srdačan pozdrav,
Ordinacija Psihocentrala`;
}

export async function sendPendingAppointmentReminders(
  props: {
    signal?: AbortSignal;
  } = {},
) {
  const signal = props.signal || new AbortController().signal;

  if (signal.aborted) {
    throw new Error('Aborted');
  }

  function onAbort() {
    console.log('aborted reminder sending!');
    throw new Error('Aborted');
  }
  signal.addEventListener('abort', onAbort);

  const pendingAppointments = await fetchPendingAppointmentReminders();

  for (const entry of pendingAppointments) {
    const {phoneNumber, time, therapist} = entry;

    const message = generateReminderText(time, therapist);

    console.log('Sending SMS', {message, phoneNumber, chars: message.length});
    // const result = await SmsModule.sendSms(phoneNumber, message);
    // console.log('SMS Sending result: ', result);
    await sleep(200);
  }

  console.log('finished sending reminders');
  signal.removeEventListener('abort', onAbort);
}

export function initRemindersBackgroundTask() {
  const abortController = new AbortController();

  // BackgroundFetch event handler.
  async function onEvent(taskId: string) {
    console.log('[BackgroundFetch] task: ', taskId);
    // Do your background work...
    await sendPendingAppointmentReminders({signal: abortController.signal});

    // Close the database when background task ends
    DB.getDatabase().close();
    // IMPORTANT:  You must signal to the OS that your task is complete.
    BackgroundFetch.finish(taskId);
  }

  // Timeout callback is executed when your Task has exceeded its allowed
  // running-time. You must stop what you're doing immediately
  async function onTimeout(taskId: string) {
    console.warn('[BackgroundFetch] TIMEOUT task: ', taskId);
    abortController.abort();

    // Close the database when background task ends
    DB.getDatabase().close();
    BackgroundFetch.finish(taskId);
  }

  // Initialize BackgroundFetch only once when component mounts.
  BackgroundFetch.configure(
    {
      minimumFetchInterval: 15,
      requiredNetworkType: BackgroundFetch.NETWORK_TYPE_NOT_ROAMING,
    },
    onEvent,
    onTimeout,
  ).then(status => {
    console.log('[BackgroundFetch] configure status: ', status);
  });

  return {
    stop: () => {
      console.log('Stopping background task...');
      return BackgroundFetch.stop();
    },
  };
}
