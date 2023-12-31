import { resolve } from 'path';


export const routes = [
  {
    name: 'authentication.page',
    path: '/authentication',
    file: resolve('./modules/authentication/page.vue')
  },
  {
    path: '/',
    file: resolve('./modules/general/wrapper.vue'),
    children: [
      {
        name: 'general.home',
        path: '',
        file: resolve('./modules/home/page.vue'),
      },
      {
        name: 'general.socket',
        path: '/socketio',
        file: resolve('./modules/home/socket-page.vue'),
      },
      {
        name: 'general.stomp',
        path: '/stomp',
        file: resolve('./modules/home/stomp-page.vue'),
      },
      {
        name: 'general.user-stomp',
        path: '/user-stomp',
        file: resolve('./modules/home/user-stomp-page.vue'),
      },
    ],
  },
];
