"use strict";
// Copyright ©2000-2025 Quinn A Michaels; All rights reserved. 
// Legal Signature Required For Lawful Use.
// Distributed under VLA:50160730846943394801 LICENSE.md
// "Thursday, December 18, 2025 - 11:02:05 AM

// Communication Test File

const {expect} = require('chai')
const CommunicationDeva = require('./index.js');

describe(CommunicationDeva.me.name, () => {
  beforeEach(() => {
    return CommunicationDeva.init()
  });
  it('Check the DEVA Object', () => {
    expect(CommunicationDeva).to.be.an('object');
    expect(CommunicationDeva).to.have.property('agent');
    expect(CommunicationDeva).to.have.property('vars');
    expect(CommunicationDeva).to.have.property('listeners');
    expect(CommunicationDeva).to.have.property('methods');
    expect(CommunicationDeva).to.have.property('modules');
  });
});
