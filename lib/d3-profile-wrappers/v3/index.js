/**
 * Copyright 2016 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* eslint-disable no-console */

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PersonalityProfile = function () {
  function PersonalityProfile(profile, traitNames) {
    _classCallCheck(this, PersonalityProfile);

    this._traitNames = traitNames;
    this._traits = profile.personality;
    this._needs = profile.needs;
    this._values = profile.values;
  }

  /**
  * Creates a tree object matching the format used by D3 tree visualizations:
  *   each node in the tree must have a 'name' and 'children' attribute except leaf nodes
  *   which only require a 'name' attribute
  **/


  _createClass(PersonalityProfile, [{
    key: 'd3Json',
    value: function d3Json() {
      return {
        tree: {
          children: [{
            name: 'Big 5',
            id: 'personality',
            children: [this.traitsTree()]
          }, {
            name: 'Values',
            id: 'values',
            children: [this.valuesTree()]
          }, {
            name: 'Needs',
            id: 'needs',
            children: [this.needsTree()]
          }]
        }
      };
    }
  }, {
    key: 'traitsTree',
    value: function traitsTree() {
      var self = this;
      var mostSignificantTrait = this.mostSignificantChild(this._traits);
      return {
        name: self._traitNames.name(mostSignificantTrait.trait_id),
        id: mostSignificantTrait.trait_id + '_parent',
        category: mostSignificantTrait.category,
        score: mostSignificantTrait.percentile,
        children: this._traits.map(function (t) {
          return {
            name: self._traitNames.name(t.trait_id),
            id: t.trait_id,
            category: t.category,
            score: t.percentile,
            children: t.children.map(function (f) {
              return {
                name: self._traitNames.name(f.trait_id),
                id: f.trait_id,
                category: f.category,
                score: f.percentile
              };
            })
          };
        })
      };
    }
  }, {
    key: 'needsTree',
    value: function needsTree() {
      var self = this;
      var mostSignificantNeed = this.mostSignificantChild(this._needs);
      return {
        name: self._traitNames.name(mostSignificantNeed.trait_id),
        id: mostSignificantNeed.trait_id + '_parent',
        category: mostSignificantNeed.category,
        score: mostSignificantNeed.percentile,
        children: this._needs.map(function (n) {
          return {
            name: self._traitNames.name(n.trait_id),
            id: n.trait_id,
            category: n.category,
            score: n.percentile
          };
        })
      };
    }
  }, {
    key: 'valuesTree',
    value: function valuesTree() {
      var self = this;
      var mostSignificantValue = this.mostSignificantChild(this._values);
      return {
        name: self._traitNames.name(mostSignificantValue.trait_id),
        id: mostSignificantValue.trait_id + '_parent',
        category: mostSignificantValue.category,
        score: mostSignificantValue.percentile,
        children: this._values.map(function (v) {
          return {
            name: self._traitNames.name(v.trait_id),
            id: v.trait_id,
            category: v.category,
            score: v.percentile
          };
        })
      };
    }
  }, {
    key: 'mostSignificantChild',
    value: function mostSignificantChild(children) {
      var threshold = 0.5;
      var farthestDistance = 0;
      var childWithScoreFarthestFromThreshold = {};

      for (var i = 0; i < children.length; i++) {
        var distance = Math.abs(children[i].percentile - threshold);
        if (distance >= farthestDistance) {
          childWithScoreFarthestFromThreshold = children[i];
          farthestDistance = distance;
        }
      }
      return childWithScoreFarthestFromThreshold;
    }
  }]);

  return PersonalityProfile;
}();

module.exports = PersonalityProfile;