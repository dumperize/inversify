import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import 'reflect-metadata';

import { RootStore } from 'rootStore2';
import { reloadLocal } from 'rootStore2/links'


const AppRoot = () => {
  const [state, setState] = useState(1);
  const { scheduleItemsStore } = RootStore;
  const schedule = scheduleItemsStore.getById(1);

  console.log('render');

  const obClick2 = () => {
    reloadLocal();
    setState(prev => prev + 1);
  };

  const obClick = () => schedule?.academicYear?.setName('Hey');
  const obClick3 = () => schedule?.academicYear?.setName('Hey3');
  const obClick4 = () => schedule?.subject?.setName('Геометрия');
  const obClick5 = () => schedule?.subject?.setName('Прикладная');
  return (
    <>
      <p>{`schedule id: ${schedule?.id}`}</p>
      <p>{`schedule year name: ${schedule?.academicYear?.name}`}</p>
      <p>{`schedule subject name: ${schedule?.subject?.name}`}</p>
      <Button color="primary" onClick={obClick2}>rebind</Button>
      <Button onClick={obClick}>set Name Year</Button>
      <Button onClick={obClick3}>set Name Year 2</Button>
      <Button onClick={obClick4}>set Name Subject 2</Button>
      <Button onClick={obClick5}>set Name Subject 2</Button>
    </>
  );
};

export default observer(AppRoot);
