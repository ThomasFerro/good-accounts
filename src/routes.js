import Account from '@/account/Account';
import EntryForm from '@/account/EntryForm';

export default [
  {
    path: '/account',
    name: 'account',
    component: Account,
  }, {
    path: '/new',
    name: 'newEntry',
    component: EntryForm,
  }, {
    path: '/',
    name: 'home',
    redirect: { name: 'account' },
  },
];
