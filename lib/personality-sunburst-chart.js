/**
 * Copyright 2014-2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

/* global document */
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SunburstWidget = require('./widget');

var PersonalitySunburstChartImpl = function () {
  function PersonalitySunburstChartImpl(options, D3PersonalityProfile, ChartRenderer, PersonalityTraitNames) {
    _classCallCheck(this, PersonalitySunburstChartImpl);

    this.D3PersonalityProfile = D3PersonalityProfile;
    this.ChartRenderer = ChartRenderer;
    this._options = options;
    this._selector = options.selector;
    this._element = options.element;
    this._locale = options.locale;
    this._colors = options.colors;
    this._imageUrl = '';
    this._profile = null;
    this._widget = null;
    this._traitNames = new PersonalityTraitNames({ locale: this._locale });
  }

  _createClass(PersonalitySunburstChartImpl, [{
    key: 'setLocale',
    value: function setLocale(locale) {
      var render = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      if (this._locale !== locale) {
        this._locale = locale;
        this._traitNames.setLocale(locale);

        if (this._profile && this._widget) {
          var d3Profile = new this.D3PersonalityProfile(this._profile, this._traitNames);
          this._widget.setData(d3Profile.d3Json());

          if (render) {
            this._widget.updateText();
          }
        }
      }
    }
  }, {
    key: 'setImage',
    value: function setImage(url) {
      var render = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      if (this._imageUrl !== url) {
        this._imageUrl = url;

        if (this._widget && render) {
          this._widget.changeImage(url);
        }
      }
    }
  }, {
    key: 'setProfile',
    value: function setProfile(profile) {
      var render = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      if (this._profile !== profile) {
        this._profile = profile;

        if (this._widget) {
          if (this._profile) {
            var d3Profile = new this.D3PersonalityProfile(this._profile, this._traitNames);
            this._widget.setData(d3Profile.d3Json());
          } else {
            this._widget.clearData();
          }
        }
      } else if (this._widget && this._profile && !this._widget.hasData()) {
        // initilize data
        var _d3Profile = new this.D3PersonalityProfile(this._profile, this._traitNames);
        this._widget.setData(_d3Profile.d3Json());
      }

      if (render) {
        this.render();
      }
    }
  }, {
    key: 'setColors',
    value: function setColors(colors) {
      var render = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      if (!colors) {
        return;
      }
      this._colors = colors;
      if (this._widget) {
        this._widget.setColors(this._colors);

        if (render) {
          this._widget.updateColors();
        }
      }
    }
  }, {
    key: 'render',
    value: function render() {
      if (this._widget) {
        this._widget.init();

        // Render widget
        this._widget.render();
        this._widget.updateText();
        this._widget.updateColors();

        // Expand all sectors of the sunburst chart - sectors at each level can be hidden
        this._widget.expandAll();

        // Add an image of the person for whom the profile was generated
        if (this._imageUrl) {
          this._widget.addImage(this._imageUrl);
        }
      } else {
        this.show();
      }
    }

    /**
     * Renders the sunburst visualization. The parameter is the tree as returned
     * from the Personality Insights JSON API.
     * It uses the arguments widgetId, widgetWidth, widgetHeight and personImageUrl
     * declared on top of this script.
     */

  }, {
    key: 'show',
    value: function show(theProfile, personImageUrl, colors) {
      if (!this._widget) {
        // Create widget
        this._widget = new SunburstWidget(this._options, this.ChartRenderer);
        var element = this._element || document.querySelector(this._selector);
        this._widget.setElement(element);
      }

      // Clear DOM element that will display the sunburst chart
      this._widget.clear();

      this.setProfile(theProfile || this._profile, false);
      this.setImage(personImageUrl || this._imageUrl, false);
      this.setColors(colors || this._colors, false);

      // Render widget
      this.render();
    }
  }]);

  return PersonalitySunburstChartImpl;
}();

module.exports = PersonalitySunburstChartImpl;