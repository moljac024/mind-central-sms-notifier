import BackgroundFetch from 'react-native-background-fetch';
import {z} from 'zod';
import axios from 'axios';

import {sleep} from '../lib/time';
import {DB} from './db';
import {fetchJSON} from '../lib/http';
import {getApplicationConfig} from '../lib/config';
import {SmsModule} from '../modules/native';

export type IAppointmentService = {
  fetchPendingAppointmentReminders: () => Promise<
    Array<{
      phoneNumber: string;
      message: string;
    }>
  >;
  sendPendingAppointmentReminders: (props?: {
    signal?: AbortSignal;
  }) => Promise<void>;
  initRemindersBackgroundTask: () => {
    stop: () => Promise<boolean>;
  };
};

export function MakeAppointmentService(config: {
  baseApiUrl: string;
}): IAppointmentService {
  async function fetchPendingAppointmentReminders() {
    const schema = z.object({
      data: z.array(
        z.object({
          bookingId: z.number(),
          phoneNumber: z.string(),
          message: z.string(),
        }),
      ),
    });

    const response = await fetchJSON(
      schema,
      `${config.baseApiUrl}/api/appointments/reminders`,
    );

    return response.data;
  }

  async function confirmAppointment(bookingId: number) {
    await axios.post(`${config.baseApiUrl}/api/appointments/reminders`, {
      bookingId,
    });
  }

  async function sendPendingAppointmentReminders(
    props: {
      signal?: AbortSignal;
    } = {},
  ) {
    const signal = props.signal || new AbortController().signal;
    let isAborted = signal.aborted;

    if (isAborted) {
      throw new Error('Aborted');
    }

    function onAbort() {
      console.log('aborted reminder sending!');
      isAborted = true;
    }
    signal.addEventListener('abort', onAbort);

    const pendingAppointments = await fetchPendingAppointmentReminders();

    for (const entry of pendingAppointments) {
      if (isAborted) {
        throw new Error('Aborted');
      }

      const {phoneNumber, message} = entry;

      console.log('Sending SMS', {message, phoneNumber, chars: message.length});
      const result = await SmsModule.sendSms(phoneNumber, message);
      await confirmAppointment(entry.bookingId);
      console.log('SMS Sending result: ', result);
      await sleep(200);
    }

    console.log('finished sending reminders');
    signal.removeEventListener('abort', onAbort);
  }

  function initRemindersBackgroundTask() {
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

  return {
    fetchPendingAppointmentReminders,
    sendPendingAppointmentReminders,
    initRemindersBackgroundTask,
  };
}

export const AppointmentService = MakeAppointmentService({
  baseApiUrl: getApplicationConfig().API_URL,
});
