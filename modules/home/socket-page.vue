<script setup>
import { ref, reactive } from 'vue';
import io from 'socket.io-client';

const wsConf = reactive({
  url: 'ws://172.16.0.101:9292/ws?room=nakisa', // Change the URL to your Socket.io server
  connected: false,
  connecting: false,
});

let socket = null;

const { toastError } = useToast();

const events = ref([]);

function connectSocket() {
  wsConf.connected = false;
  wsConf.connecting = true;

  if (socket) {
    socket.close();
  }

  socket = io(wsConf.url);

  events.value.push({
    type: 'connecting',
    at: new Date(),
  });

  socket.on('connect', () => {
    wsConf.connected = true;
    wsConf.connecting = false;

    events.value.push({
      type: 'connected',
      at: new Date(),
    });
  });

  socket.on('message', (data) => {
    events.value.push({
      type: 'received',
      data,
      at: new Date(),
    });
  });

  socket.on('disconnect', () => {
    wsConf.connected = false;

    events.value.push({
      type: 'disconnected',
      at: new Date(),
    });
  });

  socket.on('error', (error) => {
    wsConf.connecting = false;
    wsConf.connected = false;

    events.value.push({
      type: 'error',
      error,
      at: new Date(),
    });
  });
}

const sendConf = reactive({
  data: '',
});

function sendData() {
  if (!socket || !wsConf.connected) {
    return toastError({
      title: 'Socket.io is not connected.',
    });
  }

  socket.emit('chat message', sendConf.data);

  events.value.push({
    type: 'sent',
    data: sendConf.data,
    at: new Date(),
  });
}
</script>

<template>
  <v-container fluid style="max-width: 1024px">
    <v-row>
      <v-col cols="12" md="6">
        <v-card prepend-icon="mdi-server" title="Socket IO Connection">
          <v-card-text>
            <u-form
              :target="wsConf"
              :fields="[
                {
                  key: 'url',
                  identifier: 'text',
                  label: 'Socket.io Server Url'
                }
              ]"
            />
          </v-card-text>

          <v-card-actions class="justify-end">
            <v-chip
              v-if="!wsConf.connected"
              variant="tonal"
              color="error"
              prepend-icon="mdi-alert"
              text="Not Connected"
              size="small"
            />
            <v-chip
              v-else
              variant="tonal"
              color="success"
              prepend-icon="mdi-check"
              text="Connected"
              size="small"
            />

            <v-btn
              color="primary"
              size="large"
              class="ms-3"
              :loading="wsConf.connecting"
              @click="connectSocket()"
            >
              Connect Socket.io
            </v-btn>
          </v-card-actions>
        </v-card>

        <v-card
          prepend-icon="mdi-send"
          title="Send Data"
          :disabled="!wsConf.connected"
          class="mt-4"
        >
          <v-card-text>
            <u-form
              :target="sendConf"
              :fields="[
                {
                  key: 'data',
                  identifier: 'textarea',
                  label: 'Data'
                }
              ]"
            />
          </v-card-text>

          <v-card-actions class="justify-end">
            <v-btn
              color="primary"
              size="large"
              :disabled="!sendConf.data"
              @click="sendData()"
            >
              Send Data
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card prepend-icon="mdi-database" title="Events">
          <v-code>
            <pre>{{ events }}</pre>
          </v-code>

          <v-card-actions class="justify-end">
            <v-btn color="primary" size="large" @click="events = []">
              Clear Events
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

