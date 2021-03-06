/**
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * http://blockly.googlecode.com/
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

/**
 * @fileoverview Generating Dart for list blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

Blockly.Dart = Blockly.Generator.get('Dart');

Blockly.Dart.lists_create_empty = function() {
  // Create an empty list.
  return ['[]', Blockly.Dart.ORDER_ATOMIC];
};

Blockly.Dart.lists_create_with = function() {
  // Create a list with any number of elements of any type.
  var code = new Array(this.itemCount_);
  for (var n = 0; n < this.itemCount_; n++) {
    code[n] = Blockly.Dart.valueToCode(this, 'ADD' + n,
        Blockly.Dart.ORDER_NONE) || 'null';
  }
  var code = '[' + code.join(', ') + ']';
  return [code, Blockly.Dart.ORDER_ATOMIC];
};

Blockly.Dart.lists_repeat = function() {
  // Create a list with one element repeated.
  if (!Blockly.Dart.definitions_['lists_repeat']) {
    // Function adapted from Closure's goog.array.repeat.
    var functionName = Blockly.Dart.variableDB_.getDistinctName('lists_repeat',
        Blockly.Generator.NAME_TYPE);
    Blockly.Dart.lists_repeat.repeat = functionName;
    var func = [];
    func.push('List ' + functionName + '(value, n) {');
    func.push('  var array = new List(n);');
    func.push('  for (int i = 0; i < n; i++) {');
    func.push('    array[i] = value;');
    func.push('  }');
    func.push('  return array;');
    func.push('}');
    Blockly.Dart.definitions_['lists_repeat'] = func.join('\n');
  }
  var argument0 = Blockly.Dart.valueToCode(this, 'ITEM', true) || 'null';
  var argument1 = Blockly.Dart.valueToCode(this, 'NUM') || '0';
  var code = Blockly.Dart.lists_repeat.repeat +
      '(' + argument0 + ', ' + argument1 + ')';
  return [code, Blockly.Dart.ORDER_UNARY_POSTFIX];
};

Blockly.Dart.lists_length = function() {
  // List length.
  var argument0 = Blockly.Dart.valueToCode(this, 'VALUE',
      Blockly.Dart.ORDER_UNARY_POSTFIX) || '[]';
  return [argument0 + '.length', Blockly.Dart.ORDER_UNARY_POSTFIX];
};

Blockly.Dart.lists_isEmpty = function() {
  // Is the list empty?
  var argument0 = Blockly.Dart.valueToCode(this, 'VALUE',
      Blockly.Dart.ORDER_UNARY_POSTFIX) || '[]';
  return [argument0 + '.isEmpty', Blockly.Dart.ORDER_UNARY_POSTFIX];
};

Blockly.Dart.lists_indexOf = function() {
  // Find an item in the list.
  var operator = this.getTitleValue('END') == 'FIRST' ?
      'indexOf' : 'lastIndexOf';
  var argument0 = Blockly.Dart.valueToCode(this, 'FIND',
      Blockly.Dart.ORDER_NONE) || '\'\'';
  var argument1 = Blockly.Dart.valueToCode(this, 'VALUE',
      Blockly.Dart.ORDER_UNARY_POSTFIX) || '[]';
  var code = argument1 + '.' + operator + '(' + argument0 + ') + 1';
  return [code, Blockly.Dart.ORDER_UNARY_POSTFIX];
};

Blockly.Dart.lists_getIndex = function() {
  // Get element at index.
  var argument0 = Blockly.Dart.valueToCode(this, 'AT',
      Blockly.Dart.ORDER_NONE) || '1';
  var argument1 = Blockly.Dart.valueToCode(this, 'VALUE',
      Blockly.Dart.ORDER_UNARY_POSTFIX) || '[]';
  // Blockly uses one-based arrays.
  if (argument0.match(/^-?\d+$/)) {
    // If the index is a naked number, decrement it right now.
    argument0 = parseInt(argument0, 10) - 1;
  } else {
    // If the index is dynamic, decrement it in code.
    argument0 += ' - 1';
  }
  var code = argument1 + '[' + argument0 + ']';
  return [code, Blockly.Dart.ORDER_UNARY_POSTFIX];
};

Blockly.Dart.lists_setIndex = function() {
  // Set element at index.
  var argument0 = Blockly.Dart.valueToCode(this, 'AT',
      Blockly.Dart.ORDER_ADDITIVE) || '1';
  var argument1 = Blockly.Dart.valueToCode(this, 'LIST',
      Blockly.Dart.ORDER_UNARY_POSTFIX) || '[]';
  var argument2 = Blockly.Dart.valueToCode(this, 'TO',
      Blockly.Dart.ORDER_ASSIGNMENT) || 'null';
  // Blockly uses one-based indicies.
  if (argument0.match(/^\d+$/)) {
    // If the index is a naked number, decrement it right now.
    argument0 = parseInt(argument0, 10) - 1;
  } else {
    // If the index is dynamic, decrement it in code.
    argument0 += ' - 1';
  }
  return argument1 + '[' + argument0 + '] = ' + argument2 + ';\n';
};
