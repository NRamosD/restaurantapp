import * as React from 'react';
import renderer from 'react-test-renderer';

import { CText } from '../CText';

it(`renders correctly`, () => {
  const tree = renderer.create(<CText>Snapshot test!</CText>).toJSON();

  expect(tree).toMatchSnapshot();
});
