/* eslint no-var: 0 */
/* globals describe,commonSpec,it,expect */
/* jshint varstmt: false */
'use strict';

describe('Generator service', function() {
  var spec = {};

  commonSpec(spec);

  describe('purchase', function() {
    it('should return the price of a generator', function() {
      spec.state.player = {};
      spec.state.player.elements = {'H':{}};
      spec.state.player.elements.H = {'generators':{}};
      spec.state.player.elements.H.generators['Tier 1'] = 5;

      var value = spec.generator.generatorPrice('Tier 1','H');

      expect(value).toEqual(20);
    });

    it('should return the price of a generator 2', function() {
      spec.state.player = {};
      spec.state.player.elements = {'H':{}};
      spec.state.player.elements.H = {'generators':{}};
      spec.state.player.elements.H.generators['Tier 3'] = 10;

      var value = spec.generator.generatorPrice('Tier 3','H');

      expect(value).toEqual(1792);
    });

    it('should purchase as many generators as requested', function() {
      spec.state.player = {elements:{},resources:{}};
      spec.state.player.resources['1H'] = {number:65};
      spec.state.player.elements.H = {generators:{}};
      spec.state.player.elements.H.generators['Tier 1'] = 5;

      spec.generator.buyGenerators('Tier 1','H',3);

      expect(spec.state.player.resources['1H'].number).toEqual(2);
      expect(spec.state.player.elements.H.generators['Tier 1']).toEqual(8);
    });

    it('should purchase as many generators as possible until money runs out requested', function() {
      spec.state.player = {elements:{},resources:{}};
      spec.state.player.resources['1H'] = {number:45};
      spec.state.player.elements.H = {generators:{}};
      spec.state.player.elements.H.generators['Tier 1'] = 5;

      spec.generator.buyGenerators('Tier 1','H',3);

      expect(spec.state.player.resources['1H'].number).toEqual(4);
      expect(spec.state.player.elements.H.generators['Tier 1']).toEqual(7);
    });

    it('should not purchase negative generators', function() {
      spec.state.player = {elements:{},resources:{}};
      spec.state.player.resources['1H'] = {number:10};
      spec.state.player.elements.H = {generators:{}};
      spec.state.player.elements.H.generators['Tier 1'] = 5;

      spec.generator.buyGenerators('Tier 1','H',-10);

      expect(spec.state.player.resources['1H'].number).toEqual(10);
      expect(spec.state.player.elements.H.generators['Tier 1']).toEqual(5);
    });

    it('should not purchase generator if cost is not met', function() {
      spec.state.player = {elements:{},resources:{}};
      spec.state.player.resources['1H'] = {number:10};
      spec.state.player.elements.H = {generators:{}};
      spec.state.player.elements.H.generators['Tier 1'] = 5;

      spec.generator.buyGenerators('Tier 1','H',10);

      expect(spec.state.player.resources['1H'].number).toEqual(10);
      expect(spec.state.player.elements.H.generators['Tier 1']).toEqual(5);
    });
  });

  describe('production functions', function() {
    it('should calculate the generator production', function() {
      spec.data.generators['Tier 1'].upgrades = ['Tier 1-1','Tier 1-2','Tier 1-3'];
      spec.state.player = {elements:{}, resources:{}};
      spec.state.player.resources.xH = {number: 0};
      spec.state.player.elements.H = {upgrades:{}};
      spec.state.player.elements.H.upgrades['Tier 1-1'] = true;
      spec.state.player.elements.H.upgrades['Tier 1-2'] = true;
      spec.state.player.elements.H.upgrades['Tier 1-3'] = false;

      var value = spec.generator.generatorProduction('Tier 1','H');

      expect(value).toEqual(6);
    });

    it('should calculate the generator production with exotic matter', function() {
      spec.data.generators['Tier 1'].upgrades = ['Tier 1-1','Tier 1-2','Tier 1-3'];
      spec.state.player = {elements:{}, resources:{}};
      spec.state.player.resources.xH = {number: 3250};
      spec.state.player.elements.H = {upgrades:{}};
      spec.state.player.elements.H.upgrades['Tier 1-1'] = true;
      spec.state.player.elements.H.upgrades['Tier 1-2'] = true;
      spec.state.player.elements.H.upgrades['Tier 1-3'] = false;

      var value = spec.generator.generatorProduction('Tier 1','H');

      expect(value).toEqual(25);
    });

    it('should calculate the tier production', function() {
      spec.data.generators['Tier 1'].upgrades = ['Tier 1-1','Tier 1-2','Tier 1-3'];
      spec.state.player = {elements:{}, resources:{}};
      spec.state.player.resources.xH = {number: 0};
      spec.state.player.elements.H = {upgrades:{},generators:{}};
      spec.state.player.elements.H.upgrades['Tier 1-1'] = true;
      spec.state.player.elements.H.upgrades['Tier 1-2'] = true;
      spec.state.player.elements.H.upgrades['Tier 1-3'] = false;
      spec.state.player.elements.H.generators['Tier 1'] = 10;

      var value = spec.generator.tierProduction('Tier 1','H');

      expect(value).toEqual(60);
    });

    it('should calculate the element production', function() {
      spec.data.generators['Tier 1'].upgrades = [];
      spec.data.generators['Tier 2'].upgrades = [];
      spec.data.generators['Tier 3'].upgrades = [];
      var temp1 = spec.data.generators['Tier 1'];
      var temp2 = spec.data.generators['Tier 2'];
      var temp3 = spec.data.generators['Tier 3'];
      spec.data.generators = {};
      spec.data.generators['Tier 1'] = temp1;
      spec.data.generators['Tier 2'] = temp2;
      spec.data.generators['Tier 3'] = temp3;

      spec.state.player = {elements:{}, resources:{}};
      spec.state.player.resources.xH = {number: 0};
      spec.state.player.elements.H = {generators:{}};
      spec.state.player.elements.H.generators['Tier 1'] = 1;
      spec.state.player.elements.H.generators['Tier 2'] = 1;
      spec.state.player.elements.H.generators['Tier 3'] = 1;

      var value = spec.generator.elementProduction('H');

      expect(value).toEqual(91);
    });
  });
});
