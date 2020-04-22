import {decorate, observable, action, computed, extendObservable} from "mobx";
import React from "react";
import {fromPairs, isEmpty, groupBy, keys, last} from 'lodash';
import {generateUid} from "./utils/uid";

export class TemplateItem {
  x = 0;
  y = 0;
  h = 1;
  w = 1;
  i = generateUid();
  static = false
  valueType = 'text';
  dataType = 'TEXT';
  value = '';
  label = '';
  style = {};

  changeValue = e => this.value = e.target.value;
  setValue = val => this.value = val;
  setValueType = val => this.valueType = val;
  setDataType = val => this.dataType = val;
  setLabel = val => this.label = val;
  addStyle = (s, v) => this.style = {...this.style, [s]: v}
  setStyle = val => this.style = val;

  removeStyle = s => {
    const newStyle = Object.keys(this.style).reduce((object, key) => {
      if (key !== s) {
        object[key] = this.style[key]
      }
      return object
    }, {});
    this.setStyle(newStyle);
  }

  hasStyle = val => {
    return this.style.hasOwnProperty(val);
  }

  changeSize = (w, h, x, y) => {
    this.w = w;
    this.h = h;
    this.x = x;
    this.y = y;
  };

  changeValue1 = (value, type, dataType, label) => {
    this.setValue(value);
    this.setValueType(type);
    this.setDataType(dataType);
    this.setLabel(label);
  }
}

decorate(TemplateItem, {
  x: observable,
  y: observable,
  h: observable,
  w: observable,
  i: observable,
  static: observable,
  valueType: observable,
  value: observable,
  dataType: observable,
  label: observable,
  style: observable,

  changeValue: action,
  setValue: action,
  setValueType: action,
  changeValue1: action,
  changeSize: action,
  setLabel: action,
  setDataType: action,
  addStyle: action,
  setStyle: action,
  removeStyle: action
})


export class Template {
  id = generateUid();
  program = '';
  name = '';
  items = [];
  currentItem = new TemplateItem();

  changeName = e => this.name = e.target.value;

  createItem = () => {
    this.currentItem = new TemplateItem();
  }

  setCurrentItem = val => this.currentItem = val;

  addItem = () => {
    this.items = [...this.items, this.currentItem]
  }

  createImage = (value) => {
    this.currentItem = new TemplateItem();
    this.currentItem.setDataType('IMAGE');
    this.currentItem.setValueType('image');
    this.currentItem.setValue(value);
    this.addItem();
  }
}

decorate(Template, {
  id: observable,
  program: observable,
  name: observable,
  items: observable,

  changeName: action,
  createItem: action,
  addItem: action,
  setCurrentItem: action
});

export class Store {
  engine;
  data = [];
  query = '';
  page = 1;
  total = 0;
  pageSize = 10;
  sorter = 'created:desc';
  currentInstance = {};
  currentHeaders = [];
  otherInstances = [];
  visible = false;
  selectedProgram;
  currentProgram;
  programStageID = '';
  options = {};
  userOrgUnits = [];
  programs = [];
  templates = [];
  currentTemplate = new Template();
  availableAttributes = [];
  validTemplates = [];
  currentValidTemplate = '';
  parameters = {};

  constructor(engine) {
    this.engine = engine;
  }

  queryOptions = async () => {
    const q = {
      me: {
        resource: 'me.json',
        params: {
          fields: 'organisationUnits[id]'
        }
      },
      programs: {
        resource: 'programs.json',
        params: {
          paging: 'false',
          fields: 'id,name,displayName,lastUpdated,programType,trackedEntityType,trackedEntity,programTrackedEntityAttributes[mandatory,displayInList,valueType,trackedEntityAttribute[id,code,name,displayName,unique,optionSet[options[name,code]]]],programStages[id,name,displayName,repeatable,programStageDataElements[displayInReports,compulsory,dataElement[id,code,valueType,name,displayName,optionSet[options[name,code]]]]]'
        }
      }
    }
    const {me: {organisationUnits}, programs} = await this.engine.query(q);
    this.userOrgUnits = organisationUnits.map(ou => ou.id).join(';');
    this.programs = programs.programs;
  }

  queryData = async () => {
    await this.queryOptions();
    const {data} = await this.engine.query(this.currentQuery);
    const {metaData: {pager}} = data;
    this.pageSize = pager.pageSize;
    this.total = pager.total;
    this.page = pager.page;
    this.currentHeaders = data.headers;
    const headers = data.headers.map(h => h['name']);
    this.data = data.rows.map(r => {
      return Object.assign.apply({}, headers.map((v, i) => ({
        [v]: r[i]
      })));
    });
  };

  queryOtherInstances = async (vehicleNo) => {
    if (!isEmpty(vehicleNo)) {
      const params = {
        ouMode: 'DESCENDANTS',
        ou: this.userOrgUnits,
        program: this.programId,
        skipPaging: 'true',
        attribute: `h6aZFN4DLcR:EQ:${vehicleNo}`
      };

      const q = {
        trackedEntityInstances: {
          resource: 'trackedEntityInstances/query.json',
          params
        }
      }
      const {trackedEntityInstances} = await this.engine.query(q);
      const headers = trackedEntityInstances.headers.map(h => h['name']);
      this.otherInstances = trackedEntityInstances.rows.map(r => {
        return Object.assign.apply({}, headers.map((v, i) => ({
          [v]: r[i]
        })));
      });
    }
  }

  queryOneInstances = async (poe) => {
    await this.queryOptions();
    const params = {
      ouMode: 'DESCENDANTS',
      ou: this.userOrgUnits,
      program: this.programId,
      skipPaging: 'true',
      attribute: `CLzIR1Ye97b:EQ:${poe}`
    };
    const q = {
      trackedEntityInstances: {
        resource: 'trackedEntityInstances/query.json',
        params
      }
    }
    const {trackedEntityInstances} = await this.engine.query(q);
    if (trackedEntityInstances.rows.length > 0) {
      const row = trackedEntityInstances.rows[0];
      this.currentHeaders = trackedEntityInstances.headers;
      const finalRow = this.currentHeaders.map((col, index) => {
        return [col.name, row[index]];
      });
      this.currentInstance = fromPairs(finalRow);
      await this.queryOtherInstances(this.currentInstance.h6aZFN4DLcR)
    }
  }

  onSearch = async (e) => {
    this.page = 1;
    this.query = e.target.value;
    await this.queryData();
  }

  handleChange = async (pagination, filters, sorter) => {
    const order = sorter.field && sorter.order ? `${sorter.field}:${sorter.order === 'ascend' ? 'asc' : 'desc'}` : 'created:desc';
    const page = pagination.pageSize !== this.pageSize || order !== this.sorter ? 1 : pagination.current;
    this.sorter = order;
    this.page = page;
    this.pageSize = pagination.pageSize
    await this.queryData();
  }

  setVisible = val => this.visible = val;

  openDialog = () => this.setVisible(true);

  closeDialog = () => this.setVisible(false);

  setAvailableAttributes = val => this.availableAttributes = val

  includeColumns = (id) => (e) => {
    const attributes = this.availableAttributes.map((col) => {
      if (col.id === id) {
        return {...col, selected: e.target.checked}
      }
      return col;
    });
    this.setAvailableAttributes(attributes);
  }

  fetchOrCreateDataStore = async (namespace, key) => {
    const query3 = {
      [namespace]: {
        resource: `dataStore/${namespace}/${key}`
      }
    };
    try {
      const result = await this.engine.query(query3);
      return result[namespace];
    } catch (e) {
      let createMutation = {
        type: 'create',
        resource: `dataStore/${namespace}/${key}`,
        data: []
      };
      try {
        await this.engine.mutate(createMutation);
        return []
      } catch (error) {
        console.error("Failed to create store", error);
      }
    }
  }

  updateDataStore = async (namespace, key, values) => {
    let createMutation = {
      type: 'update',
      resource: `dataStore/${namespace}/${key}`,
      data: values
    };
    try {
      await this.engine.mutate(createMutation);
    } catch (error) {
      console.error("Failed to fetch projects", error);
    }
  }

  saveTemplate = async () => {
    this.currentTemplate.program = this.selectedProgram
    const index = this.templates.findIndex(t => t.id === this.currentTemplate.id);
    if (index !== -1) {
      this.templates.splice(index, 1, this.currentTemplate);
    } else {
      this.templates = [...this.templates, this.currentTemplate];
    }
    await this.updateDataStore('poe', 'templates', this.templates);
  }

  onChange = async (program) => {
    this.data = [];
    this.selectedProgram = program;
    this.currentProgram = this.programs.find(p => p.id === program);

    if (this.currentProgram.programType === 'WITHOUT_REGISTRATION') {
      this.availableAttributes = this.currentProgram.programStages[0].programStageDataElements.map(({displayInReports: selected, dataElement: {name, id}}) => {
        return {id, name, selected};
      });
    } else {
      this.availableAttributes = this.currentProgram.programTrackedEntityAttributes.map(({displayInList: selected, trackedEntityAttribute: {id, name}}) => {
        return {id, name, selected};
      });
    }
    await this.queryData();
  }

  initiate = async () => {
    await this.queryOptions();
  }

  fetchTemplates = async () => {
    this.templates = await this.fetchOrCreateDataStore('poe', 'templates')
  }

  addTemplate = () => {
    this.currentTemplate = new Template();
  }

  searchValidTemplates = (program) => {
    this.validTemplates = this.templates.filter(t => t.program === program);
  }

  setCurrentValidTemplate = async (val) => {
    this.currentValidTemplate = val;
    const template = new Template();

    let q = {
      resource: `events/${this.parameters.instance}.json`
    }

    if (this.parameters.type === 'instance') {
      q = {
        ...q,
        resource: `trackedEntityInstances/${this.parameters.instance}.json`,
        params: {fields: '*', program: this.parameters.program}
      }
    }

    const {data} = await this.engine.query({data: q});
    let processedData = {};

    if (this.parameters.type === 'instance') {
      const {attributes, enrollments, ...trackedEntityInstance} = data;

      const allAttributes = fromPairs(attributes.map(dv => {
        return [dv.attribute, dv.value]
      }));

      processedData = {...trackedEntityInstance, ...processedData, ...allAttributes}
      const enrollment = enrollments.find(e => e.program === this.parameters.program);
      if (enrollment) {
        const {events, relationships, attributes, ...others} = enrollment;
        const evs = groupBy(events, 'programStage');

        const processedEvents = keys(evs).map(k => {
          const {dataValues, ...event} = last(evs[k]);
          const dvs = fromPairs(dataValues.map(dv => {
            return [dv.dataElement, dv.value]
          }));
          return [k, {...dvs, ...event}]
        });

        const allEvents = fromPairs(processedEvents);
        processedData = {...processedData, ...allEvents, ...others};
      }
    } else {
      const {dataValues, ...event} = data;
      const dvs = fromPairs(dataValues.map(dv => {
        return [dv.dataElement, dv.value]
      }));
      processedData = {...event, ...dvs};
    }

    const {id, name, program, items} = this.validTemplates.find(t => t.id === val);

    const ti = items.map(({x, y, h, w, i, valueType, dataType, value}) => {
      const item = new TemplateItem();
      if (valueType !== 'text' && valueType !== 'image') {
        if (dataType === 'IMAGE') {
        } else {
          value = String(value).replace('{', '').replace('}', '');
          value = processedData[value];
        }
      }
      extendObservable(item, {x, y, h, w, i, valueType, dataType, static: true, value});
      return item;
    });
    extendObservable(template, {id, name, program, items: ti});
    this.currentTemplate = template;
  }

  setParameters = val => this.parameters = val;

  get currentQuery() {
    let params = {
      page: this.page,
      totalPages: 'true',
      ouMode: 'DESCENDANTS',
      ou: this.userOrgUnits,
      pageSize: this.pageSize,
      order: this.sorter
    };

    if (this.query !== '') {
      params = {...params, query: `LIKE:${this.query}`}
    }

    if (this.currentProgram.programType === 'WITHOUT_REGISTRATION') {
      params = {
        ...params,
        programStage: this.currentProgram.programStages[0].id,
        includeAllDataElements: 'true',
      };
      return {
        data: {
          resource: 'events/query.json',
          params
        }
      }
    } else {
      params = {
        ...params,
        program: this.selectedProgram
      };
      return {
        data: {
          resource: 'trackedEntityInstances/query.json',
          params
        }
      }
    }
  }

  get columns() {
    const attributes = this.availableAttributes.filter(a => a.selected).map(a => a.id);
    return this.currentHeaders.map((a) => {
      return {
        key: a.name,
        title: a.column,
        dataIndex: a.name,
        sorter: true,
        render: (text, row) => {
          // if (has(this.attributesWithOptionSet, a.name)) {
          //   return <div>{this.options[this.attributesWithOptionSet[a.name]][row[a.name]]}</div>
          // }
          return <div>{row[a.name]}</div>
        }
      }
    }).filter(column => attributes.indexOf(column.key) !== -1);
  }

  get rowKey() {
    if (this.currentProgram && this.currentProgram.programType === 'WITHOUT_REGISTRATION') return 'event'
    return 'instance'
  }

  get currentProgramStage() {
    if (this.currentProgram && this.currentProgram.programType === 'WITHOUT_REGISTRATION')
      return this.currentProgram.programStages[0].id;
    return 'XXXX'
  }
}


decorate(Store, {
  engine: observable,
  data: observable,
  query: observable,
  page: observable,
  pageSize: observable,
  currentRow: observable,
  total: observable,
  visible: observable,
  options: observable,
  attributesWithOptionSet: observable,
  availableAttributes: observable,
  currentHeaders: observable,
  currentInstance: observable,
  userOrgUnits: observable,
  programStageID: observable,
  programs: observable,
  templates: observable,
  currentTemplate: observable,
  selectedProgram: observable,
  validTemplates: observable,
  currentValidTemplate: observable,
  parameters: observable,

  queryData: action,
  handleChange: action,
  onSearch: action,
  setVisible: action,
  openDialog: action,
  closeDialog: action,
  queryOtherInstances: action,
  queryOptions: action,
  setAvailableAttributes: action,
  includeColumns: action,
  queryOneInstances: action,
  saveTemplate: action,
  initiate: action,
  onChange: action,
  addTemplate: action,
  setCurrentValidTemplate: action,
  setParameters: action,
  searchValidTemplates: action,

  currentQuery: computed,
  columns: computed,
});
