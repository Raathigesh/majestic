import { Status } from './stores/types/JestRepoter';

const main = {
  main: '#26282A',
  primary: '#E73C2F',
  secondary: '#EBEDF0',
  text: 'white',
  extra: {
    moon: '#8484FF',
    mercury: '#03c803',
    jupitor: '#008dfc',
    mars: '#ffcd08'
  }
};

export function getColorForStatus(status: Status) {
  switch (status) {
    case 'passed':
      return main.extra.mercury;
    case 'failed':
      return main.primary;
    case 'pending':
      return main.extra.jupitor;
    default:
      return main.extra.jupitor;
  }
}

export default main;
