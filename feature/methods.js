"use strict";
// Copyright ©2000-2025 Quinn A Michaels; All rights reserved. 
// Legal Signature Required For Lawful Use.
// Distributed under VLA:50160730846943394801 LICENSE.md
// "Thursday, December 18, 2025 - 11:02:05 AM

export default {
  /**************
  method: communication
  params: packet
  describe: The global communication feature that installs with every agent
  ***************/
  async communication(packet) {
    const communication = await this.methods.sign('communication', 'default', packet);
    return communication;
  },
};