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
    this._traits = profile.tree.children[0].children[0];
    this._needs = profile.tree.children[1].children[0];
    this._values = profile.tree.children[2].children[0];
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
      var mostSignificantValue = this.mostSignificantChild(this._traits.children);
      return {
        name: self._traitNames.name(mostSignificantValue.id),
        id: mostSignificantValue.id + '_parent',
        category: mostSignificantValue.category,
        score: mostSignificantValue.percentage,
        children: this._traits.children.map(function (t) {
          return {
            name: self._traitNames.name(t.id),
            id: t.id,
            category: t.category,
            score: t.percentage,
            children: t.children.map(function (f) {
              return {
                name: self._traitNames.name(f.id),
                id: f.id,
                category: f.category,
                score: f.percentage
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
      var mostSignificantValue = this.mostSignificantChild(this._needs.children);
      return {
        name: self._traitNames.name(mostSignificantValue.id),
        id: mostSignificantValue.id + '_parent',
        category: mostSignificantValue.category,
        score: mostSignificantValue.percentage,
        children: this._needs.children.map(function (n) {
          return {
            name: self._traitNames.name(n.id),
            id: n.id,
            category: n.category,
            score: n.percentage
          };
        })
      };
    }
  }, {
    key: 'valuesTree',
    value: function valuesTree() {
      var self = this;
      var mostSignificantValue = this.mostSignificantChild(this._values.children);
      return {
        name: self._traitNames.name(mostSignificantValue.id),
        id: mostSignificantValue.id + '_parent',
        category: mostSignificantValue.category,
        score: mostSignificantValue.percentage,
        children: this._values.children.map(function (v) {
          return {
            name: self._traitNames.name(v.id),
            id: v.id,
            category: v.category,
            score: v.percentage
          };
        })
      };
    }
  }, {
    key: 'mostSignificantChild',
    value: function mostSignificantChild(children) {
      var threshold = 0.5;
      var farthestDistance = 0;
      var childWithScoreFarthestFromThreshold = null;

      for (var i = 0; i < children.length; i++) {
        var distance = Math.abs(children[i].percentage - threshold);
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