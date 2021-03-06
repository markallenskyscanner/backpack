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
/* @flow */
import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import {
  BpkCalendarGridHeader,
  composeCalendar,
  DateUtils,
} from 'bpk-component-calendar';

import { weekDays, formatMonth, formatDateFull } from './test-utils';
import BpkScrollableCalendar, {
  BpkScrollableCalendarDate,
  BpkScrollableCalendarGrid,
  BpkScrollableCalendarGridList,
} from './index';

const BpkCalendar = composeCalendar(
  null,
  BpkCalendarGridHeader,
  BpkScrollableCalendarGridList,
  BpkScrollableCalendarDate,
);

storiesOf('bpk-component-scrollable-calendar', module)
  .add('Default', () => <BpkScrollableCalendar />)
  .add('BpkScrollableCalendarDate', () => (
    <BpkScrollableCalendarDate
      date={new Date()}
      onDateClick={action('Clicked day')}
    />
  ))
  .add('BpkScrollableCalendarGrid', () => (
    <BpkScrollableCalendarGrid
      month={new Date(2019, 1, 0)}
      weekStartsOn={1}
      daysOfWeek={weekDays}
      onDateClick={action('Clicked day')}
      formatMonth={formatMonth}
      formatDateFull={formatDateFull}
      DateComponent={BpkScrollableCalendarDate}
      showWeekendSeparator
    />
  ))
  .add('BpkScrollableCalendarGridList', () => (
    <BpkScrollableCalendarGridList
      month={new Date()}
      weekStartsOn={1}
      daysOfWeek={weekDays}
      onDateClick={action('Clicked day')}
      formatMonth={formatMonth}
      formatDateFull={formatDateFull}
      DateComponent={BpkScrollableCalendarDate}
      showWeekendSeparator
      minDate={DateUtils.addDays(new Date(), -1)}
      maxDate={DateUtils.addMonths(new Date(), 12)}
    />
  ))
  .add('Calendar - default', () => (
    <BpkCalendar
      month={new Date()}
      weekStartsOn={1}
      daysOfWeek={weekDays}
      onDateClick={action('Clicked day')}
      formatMonth={formatMonth}
      formatDateFull={formatDateFull}
      DateComponent={BpkScrollableCalendarDate}
      showWeekendSeparator
      // Subtract one day from today's date to make today selectable by default
      minDate={DateUtils.addDays(new Date(), -1)}
      maxDate={DateUtils.addMonths(new Date(), 12)}
    />
  ));
