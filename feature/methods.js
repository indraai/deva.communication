"use strict";
// Communication Deva Feature Methods
// Copyright ©2000-2026 Quinn A Michaels; All rights reserved. 
// Legal Signature Required For Lawful Use.
// Distributed under VLA:71942848282813423716 LICENSE.md
// Wednesday, January 7, 2026 - 7:08:40 PM

function buildProfile(entity, type='assistant') {
  const {profile, prompt} = entity
  return [
    `::begin:${type}:${profile.id}`,
    `id: ${profile.id}`,
    `key: ${profile.key}`,
    `hashtag: ${profile.hashtag}`,
    `emoji: ${prompt.emoji}`,
    `name: ${profile.name}`,
    `gender: ${profile.gender}`,
    `pronouns: ${profile.pronouns}`,
    `describe: ${profile.describe}`,
    `copyright: ${profile.copyright}`,
    `::end:${type}:${profile.id}`,
  ].join('\n');
}

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

  /**************
  method: ask
  params: packet
  describe: this method provides a global ask method to all agents.
  ***************/
  async ask(packet) {
    this.zone('communication', packet.id.uid);
    this.feature('communication', packet.id.uid);
    this.context('ask', `${packet.q.agent.name}:${packet.id.uid}`);
    this.action('communication', `ask:${packet.id.uid}`);
    this.state('communication', `ask:${packet.id.uid}`);
    const data = {};
    const agent = this.agent();
    const client = this.client();
    const info = this.info();
  
    this.state('get', `corpus:${packet.id.uid}`);
    const _corpus = await this.help('corpus', info.dir);
    const corpus = await this.question(`${this.askChr}feecting parse ${_corpus}`);
  
    return new Promise((resolve, reject) => {
      if (!this.vars.ask) return resolve('Ask not configured.');
  
      data.corpus = corpus.a.text;
  
      this.state('set', `history:${packet.id.uid}`);
      this.vars.ask.history.push({
        role: 'user',
        content: packet.q.text,
      });
  
      this.state('get', `ask:chat:${packet.id.uid}`);
      this.question(`${this.askChr}chat relay ${decodeURIComponent(packet.q.text)}`, {
        client: buildProfile(client, 'client'),
        agent: buildProfile(agent, 'agent'),
        corpus: corpus.a.text,
        max_tokens: this.vars.ask.max_tokens,
        history: this.vars.ask.history.slice(-10),
        memory: agent.key,
      }).then(answer => {
  
        data.chat = answer.a.data.chat;  
        const text = [
          `::begin:${agent.key}:ask:${answer.id.uid}`,
          answer.a.text,
          '---',
          '## Metadata',
          `uid: ${answer.id.uid}`,
          `chatid: ${data.chat.chatid}`,
          `model: ${data.chat.model}`,
          `tokens: ${data.chat.usage.total_tokens}`,
          `date: ${answer.id.date}`,
          `time: ${answer.id.time}`,
          `fingerprint: ${answer.id.fingerprint}`,
          `sha256: ${this.hash(answer.a.text, 'sha256')}`,
          `copyright: ${answer.id.copyright}`,
          `::end:${agent.key}:ask:${answer.id.uid}`,
        ];
        this.state('set', `history:a:${packet.id}`);
        this.vars.ask.history.push({
          role: answer.a.data.chat.role,
          content: answer.a.data.chat.text,
        });
  
        this.state('parse', `ask:${packet.id.uid}`);
        return this.question(`${this.askChr}feecting parse ${text.join('\n')}`);
      }).then(feecting => {
        data.feecting = feecting.a.data;
        this.action('resolve', `ask:${packet.id.uid}`);
        this.state('valid', `ask:${packet.id.uid}`);
        this.intent('good', `ask:${packet.id.uid}`);
        return resolve({
          text: feecting.a.text,
          html: feecting.a.html,
          data,
        });
      }).catch(err => {
        this.action('reject', 'chat');
        this.state('invalid', 'chat');
        this.intent('bad', 'chat');
        return this.err(packet, err, reject);
      });
    });
  },  
};