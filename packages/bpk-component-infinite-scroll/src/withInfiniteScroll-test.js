/*
 * Backpack - Skyscanner's Design System
 *
 * Copyright 2018 Skyscanner Ltd
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import PropTypes from 'prop-types';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import withInfiniteScroll from './withInfiniteScroll';
import onItemsFetch from './onItemsFetch';

describe('withInfiniteScroll', () => {
  const elementsArray = [];

  for (let i = 0; i < 5; i += 1) {
    elementsArray.push(`Element ${i}`);
  }

  const List = props => (
    <div id="list">
      {props.elements.map(element => <div key={element}>{element}</div>)}
    </div>
  );

  List.propTypes = {
    elements: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  const InfiniteList = withInfiniteScroll(List);
  let intersect;

  beforeEach(() => {
    global.IntersectionObserver = class {
      constructor(callback) {
        intersect = async () => callback([{ intersectionRatio: 1 }]);
      }
      observe() {} // eslint-disable-line
      unobserve() {} // eslint-disable-line
    };
  });

  it('renders an empty list for the first render', () => {
    const tree = renderer.create(
      <InfiniteList onItemsFetch={onItemsFetch(elementsArray)} />,
    );

    expect(tree).toMatchSnapshot();
  });

  it('renders items after the first render', async () => {
    const tree = mount(
      <InfiniteList onItemsFetch={onItemsFetch(elementsArray)} />,
    );

    await intersect();
    tree.update();

    expect(toJson(tree)).toMatchSnapshot();
  });

  it('should render correctly when no more elements', async () => {
    const tree = mount(
      <InfiniteList onItemsFetch={onItemsFetch(elementsArray)} />,
    );

    await intersect();
    tree.update();
    await intersect();
    tree.update();

    expect(toJson(tree)).toMatchSnapshot();
  });

  it('should render correctly with an "elementsPerScroll" attribute', async () => {
    const tree = mount(
      <InfiniteList
        onItemsFetch={onItemsFetch(elementsArray)}
        elementsPerScroll={1}
      />,
    );

    await intersect();
    tree.update();

    expect(toJson(tree)).toMatchSnapshot();
  });

  it('should render correctly with an "seeMoreComponent" attribute', async () => {
    const tree = mount(
      <InfiniteList
        onItemsFetch={onItemsFetch(elementsArray)}
        elementsPerScroll={1}
        seeMoreComponent={<button>see more</button>}
        seeMoreAfter={0}
      />,
    );

    await intersect();
    tree.update();

    expect(toJson(tree)).toMatchSnapshot();
  });

  it('should pass unused props to ComponentToExtend', () => {
    const tree = mount(
      <InfiniteList
        onItemsFetch={onItemsFetch(elementsArray)}
        extraProp="extraProp"
      />,
    );

    expect(toJson(tree)).toMatchSnapshot();
  });

  it('should call onScroll on intersection fired', async () => {
    const spy = jest.fn();
    mount(
      <InfiniteList
        onItemsFetch={onItemsFetch(elementsArray)}
        onScroll={spy}
      />,
    );

    await intersect();

    expect(spy).toHaveBeenCalledWith({
      currentIndex: 0,
    });
  });

  it('should call onScrollFinished when no more elements to render', async () => {
    const spy = jest.fn();
    mount(
      <InfiniteList onItemsFetch={onItemsFetch([])} onScrollFinished={spy} />,
    );

    await intersect();

    expect(spy).toHaveBeenCalledWith({
      totalNumberElements: 0,
    });
  });

  it('should call onSeeMoreClicked when clicked on the seeMoreComponent', async () => {
    const spy = jest.fn();
    const tree = mount(
      <InfiniteList
        onItemsFetch={onItemsFetch(elementsArray)}
        elementsPerScroll={1}
        seeMoreComponent={<button>see more</button>}
        seeMoreAfter={0}
        onClickSeeMore={spy}
      />,
    );

    await intersect();
    tree.update();

    const button = tree.find('button');
    button.simulate('click');

    expect(spy).toHaveBeenCalledWith(expect.any(Object));
  });

  it('should call onSeeMoreClicked when clicked using keyboard on the seeMoreComponent', async () => {
    const spy = jest.fn();
    const tree = mount(
      <InfiniteList
        onItemsFetch={onItemsFetch(elementsArray)}
        elementsPerScroll={1}
        seeMoreComponent={<button>see more</button>}
        seeMoreAfter={0}
        onClickSeeMore={spy}
      />,
    );

    await intersect();
    tree.update();

    const button = tree.find('button');
    button.simulate('keyPress', { key: 'Enter' });

    expect(spy).toHaveBeenCalledWith(expect.any(Object));
  });
});
