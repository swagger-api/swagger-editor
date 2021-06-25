import rewiremock from 'rewiremock';
import Enzyme, { shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import React from 'react';
import FakeAce, { Session } from 'test/unit/mocks/ace.js';
import { fromJS } from 'immutable';
import makeEditor from 'plugins/editor/components/editor';

const pause = (ms) => new Promise((res) => setTimeout(res, ms));

const EVENTUALLY = 900; // ms

/**
* We're mocking out the editor,
* so uses of the phrase "should see this in editor",
* will match to the following Ace methods:
*
* - "what user see's in editor" => fakeAce.userSees()
* - "user types something (end of document)" => fakeAce.userTypes("hi")
* - "Ctrl-Z" => fakeAce.userUndo()
* - "Ctrl-Shift-Z" => fakeAce.userRedo()
**/

describe('editor', () => {
  beforeAll(() => {
    // Enzyme.configure({ adapter: new Adapter()})
    Enzyme.configure({ adapter: new Adapter()});

    // Whole bunch of mocks!
    rewiremock.enable();
    rewiremock('brace/mode/yaml').with({});
    rewiremock('brace/theme/tomorrow_night_eighties').with({});
    rewiremock('brace/ext/language_tools').with({});
    rewiremock('brace/ext/searchbox').with({});
    rewiremock('./brace-snippets-yaml').with({});
    rewiremock('./editor.less').with({});
  });

  afterAll(() => {
    rewiremock.disable();
  });

  beforeEach(() => {
    // delete require.cache[require.resolve("react-ace")]
  });

  describe('fake ace', () => {

    it('should be an event emitter', () => {
      // Given
      const fakeAce = new FakeAce();
      const spy = jest.fn();
      fakeAce.on('foo', spy);

      // When
      fakeAce.emit('foo', 'bar');

      // Then
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy.mock.calls[0][0]).toEqual('bar');
    });

    it('should return `this`, when calling .edit', () => {
      // Given
      const fakeAce = new FakeAce();

      // When
      const res = fakeAce.edit();

      // Then
      expect(res).toBe(fakeAce);
    });


    it('should keep track of setValue', () => {
      // Given
      const fakeAce = new FakeAce();

      // When
      fakeAce.setValue('foo');

      // Then
      const res = fakeAce.getValue();
      expect(res).toEqual('foo');
    });

    it('should spy on setValue', () => {
      // Given
      const fakeAce = new FakeAce();

      // When
      fakeAce.setValue('foo');

      // Then
      expect(fakeAce.setValue.mock.calls.length).toEqual(1);
      expect(fakeAce.setValue.mock.calls[0][0]).toEqual('foo');
    });

    it('should return a single session, with getSession', () => {
      // Given
      const fakeAce = new FakeAce();

      // When
      const res = fakeAce.getSession();

      // Then
      expect(res).toBeInstanceOf(Session);
    });

    it('should add options via setOptions', () => {
      // Given
      const fakeAce = new FakeAce();

      // When
      fakeAce.setOptions({one: 'uno'});

      // Then
      const res = fakeAce.getOption('one');
      expect(res).toEqual('uno');
    });

    describe('userUndo/Redo', () => {

      it('should revert to last input', () => {
        // Given
        const fakeAce = new FakeAce();
        fakeAce.userTypes('one');

        // When
        fakeAce.userTypes('two');

        // Then
        fakeAce.userUndo();
        expect(fakeAce.userSees()).toEqual('one');
      });

      it('should revert to empty document, no changes were made', () => {
        // Given
        const fakeAce = new FakeAce();

        // When
        fakeAce.userUndo();

        // Then
        expect(fakeAce.userSees()).toEqual('');
      });

      it('should revert to empty document, after arbitrary undos', () => {
        // Given
        const fakeAce = new FakeAce();

        // When
        fakeAce.userUndo();
        fakeAce.userUndo();
        fakeAce.userUndo();
        fakeAce.userUndo();

        // Then
        expect(fakeAce.userSees()).toEqual('');
      });

      it('should not extend redos after last change', () => {
        // Given
        const fakeAce = new FakeAce();
        fakeAce.userTypes('x');

        // When
        fakeAce.userRedo();
        fakeAce.userRedo();
        fakeAce.userRedo();

        // Then
        expect(fakeAce.userSees()).toEqual('x');
      });

      it('should allow redo after single undo', () => {
        // Given
        const fakeAce = new FakeAce();
        fakeAce.userTypes('x');
        fakeAce.userTypes('x');
        fakeAce.userUndo();

        // When
        fakeAce.userRedo();

        // Then
        expect(fakeAce.userSees()).toEqual('xx');
      });

      it('should create new thread of undo stack, after new change', () => {
        // Given
        const fakeAce = new FakeAce();
        fakeAce.userTypes('1');
        fakeAce.userTypes('2');
        fakeAce.userTypes('3');
        fakeAce.userTypes('4');
        fakeAce.userUndo(); // 123
        fakeAce.userUndo(); // 12
        fakeAce.userTypes('5'); // 125

        // When
        fakeAce.userRedo(); // 125, don't extend beyond

        // Then
        expect(fakeAce.userSees()).toEqual('125');
      });

    });

    describe('fake session', () => {

      it('should keep add state for markers', () => {
        // Given
        const fakeAce = new FakeAce();
        const fakeSession = fakeAce.getSession();

        // When
        fakeSession.addMarker({one: 1});

        // Then
        const res = fakeSession.getMarkers();
        // expect(typeof res).toBe("array")
        expect(res).toBeInstanceOf(Array);
        expect(res.length).toEqual(1);
        expect(res[0]).toEqual({id: 0, one: 1});
      });

      it('should keep remove state for markers', () => {
        // Given
        const fakeAce = new FakeAce();
        const fakeSession = fakeAce.getSession();
        fakeSession.addMarker({one: 1});

        // When
        fakeSession.removeMarker(0);

        // Then
        const res = fakeSession.getMarkers();
        // expect(typeof res).toBe("array")
        expect(res).toBeInstanceOf(Array);
        expect(res.length).toEqual(0);
      });

      it('should spy on addMarker', () => {
        // Given
        const fakeAce = new FakeAce();
        const fakeSession = fakeAce.getSession();

        // When
        fakeSession.addMarker({one: 1});

        // Then
        expect(fakeSession.addMarker.mock.calls.length).toEqual(1);
      });

      it('should spy on setMode', () => {
        // Given
        const fakeAce = new FakeAce();
        const fakeSession = fakeAce.getSession();

        // When
        fakeSession.setMode();

        // Then
        expect(fakeSession.setMode.mock.calls.length).toEqual(1);
      });

      it('should have a .selection which includes toJSON, fromJSON', () => {
        // Given
        const fakeAce = new FakeAce();

        // When
        const fakeSession = fakeAce.getSession();

        // Then
        expect(Object.keys(fakeSession.selection)).toContain('toJSON');
        expect(Object.keys(fakeSession.selection)).toContain('fromJSON');
      });


      describe('userTypes', () => {
        it('should emit \'change\'', () => {
          // Given
          const fakeAce = new FakeAce();
          const spy = jest.fn();
          fakeAce.on('change', spy);

          // When
          fakeAce.userTypes('hello');

          // Then
          expect(spy.mock.calls.length).toBeGreaterThan(1);
        });

        it('should change the value', () => {
          // Given
          const fakeAce = new FakeAce();

          // When
          fakeAce.userTypes('hello');

          // Then
          expect(fakeAce.getValue()).toEqual('hello');
        });
      });

      describe('userSees', () => {
        it('should match userTypes', () => {
          // Given
          const fakeAce = new FakeAce();

          // When
          fakeAce.userTypes('hi');

          // Then
          const res = fakeAce.userSees();
          expect(res).toEqual('hi');
        });

        it('should match setValue', () => {
          // Given
          const fakeAce = new FakeAce();

          // When
          fakeAce.setValue('hello');

          // Then
          const res = fakeAce.userSees();
          expect(res).toEqual('hello');
        });
      });

    });

    describe('renderer', () => {
      it('should have a stub for setShowGutter', () => {
        // Given
        const fakeAce = new FakeAce();

        // When
        fakeAce.renderer.setShowGutter('foo');

        // Then
        expect(fakeAce.renderer.setShowGutter.mock.calls.length).toEqual(1);
        expect(fakeAce.renderer.setShowGutter.mock.calls[0][0]).toEqual('foo');
      });

    });

  });

  describe.skip('editor component', () => {

    it('should EVENTUALLY call onChange when user enters input', (done) => {

      // Given
      const fakeAce = new FakeAce();
      rewiremock('brace').with(fakeAce);
      // we should not use require
      // const makeEditor = require("plugins/editor/components/editor.jsx").default
      const Editor = makeEditor({});
      const spy = jest.fn();
      const wrapper = shallow(
        <Editor onChange={spy} />
      );
      wrapper
        .find('ReactAce').shallow();

      // When
      // Simulate user input
      fakeAce.userTypes('hello');

      // Then
      setTimeout(() => {
        expect(spy.mock.calls.length).toEqual(1);
        expect(spy.mock.calls[0][0]).toEqual('hello');
        done();
      }, EVENTUALLY);

    });

    it(
      'should EVENTUALLY put the contents of `value` prop into editor, without regard to `origin` property',
      (done) => {

        // Given
        const fakeAce = new FakeAce();
        rewiremock('brace').with(fakeAce);
        // const makeEditor = require("plugins/editor/components/editor.jsx").default
        const Editor = makeEditor({});

        // When
        const wrapper = shallow(
          <Editor value={'original value'} />
        );
        wrapper.find('ReactAce').shallow();

        // Then
        setTimeout(() => {
          expect(fakeAce.userSees()).toEqual('original value');
          done();
        }, EVENTUALLY);
      }
    );

    it(
      'should EVENTUALLY put the contents of `value` prop into editor, with `foo` origin property ',
      (done) => {

        // Given
        const fakeAce = new FakeAce();
        rewiremock('brace').with(fakeAce);
        // const makeEditor = require("plugins/editor/components/editor.jsx").default
        const Editor = makeEditor({});

        // When
        const wrapper = shallow(
          <Editor value={'original value'} origin="foo" />
        );
        wrapper.find('ReactAce').shallow();

        // Then
        setTimeout(() => {
          expect(fakeAce.userSees()).toEqual('original value');
          done();
        }, EVENTUALLY);
      }
    );

    it('should NEVER update ace if the yaml originated in editor', async () => {

      // Given
      const fakeAce = new FakeAce();
      rewiremock('brace').with(fakeAce);
      // const makeEditor = require("plugins/editor/components/editor.jsx").default
      const Editor = makeEditor({});

      // When
      const wrapper = shallow(
        <Editor value="original value" />
      );
      wrapper.find('ReactAce').shallow();
      wrapper.setProps({value: 'new value', origin: 'editor'});

      // Then
      await pause(EVENTUALLY);
      expect(fakeAce.userSees()).toEqual('original value');
    });

    // SKIPPED: Does this have any value at this level? And not editor-container?
    it.skip(
      'SKIP: should EVENTUALLY call onChange ONCE if the user types/pauses/types',
      async function() {
        this.timeout(10000);

        // Given
        const fakeAce = new FakeAce();
        rewiremock('brace').with(fakeAce);
        // const makeEditor = require("plugins/editor/components/editor.jsx").default
        const Editor = makeEditor({});
        const spy = jest.fn();
        const wrapper = shallow(
          <Editor value="original value" onChange={spy}/>
        );
        wrapper.find('ReactAce').shallow();

        // When
        fakeAce.userTypes(' one');
        await pause(EVENTUALLY / 2);
        fakeAce.userTypes('two');
        await pause(EVENTUALLY / 2);
        fakeAce.userTypes('three');
        await pause(EVENTUALLY / 2);

        await pause(EVENTUALLY * 2);
        expect(fakeAce.userSees()).toEqual('original value onetwothree');
        expect(spy.mock.calls.length).toEqual(1);
      }
    );

    it('should EVENTUALLY call onChange when ctrl-z', async () => {
      // Given
      const fakeAce = new FakeAce();
      rewiremock('react-ace').with(fakeAce);
      // const makeEditor2 = require("plugins/editor/components/editor.jsx").default
      const Editor = makeEditor({});
      const spy = jest.fn();
      const wrapper = shallow(
        <Editor value="original value CTRL-Z" onChange={spy}/>
      );
      /** Dev wip notes:
       * At this point rendering Editor with the above value is correct
       * e.g. the "render once of this.props.value" includes "CTRL-Z"
       * But using fakeAce.userSees() yields "undefined", returning ""
       * Then, after fakeAce.userTypes(), spy.mock.calls.length still === 0
       * So Editor component is not seeing the rewired fakeAce
       */
      // wrapper.find("ReactAce").shallow()
      await wrapper.instance().busy;
      // console.log("DEBUG here")
      // expect(fakeAce.userSees()).toEqual("original value")
      // expect(wrapper.find("ReactAce")).toHaveLength(1) // pass, but why pass?
      fakeAce.userTypes('one');
      expect(fakeAce.userSees()).toEqual('one');
      await pause(EVENTUALLY);
      // second wip: 2nd user input
      fakeAce.userTypes('two');
      expect(fakeAce.userSees()).toEqual('onetwo');
      expect(spy.mock.calls.length).toEqual(1);
      // When
      fakeAce.userUndo();

      fakeAce.userTypes('three');

      await pause(EVENTUALLY);
      expect(spy.mock.calls.length).toEqual(1);
      expect(fakeAce.userSees()).toEqual('original value');
    });

    describe('markers', () => {

      it('should place markers into editor', async () => {
        // Given
        const fakeAce = new FakeAce();
        const spy = jest.fn();
        rewiremock('brace').with(fakeAce);
        rewiremock('../editor-helpers/marker-placer').with({placeMarkerDecorations: spy});
        // const makeEditor = require("plugins/editor/components/editor.jsx").default
        const Editor = makeEditor({});
        const dummy = fromJS({one: 1});
        const wrapper = shallow(
          <Editor markers={dummy} />
        );

        // When
        wrapper.find('ReactAce').shallow();
        await pause(EVENTUALLY);

        // Then
        expect(spy.mock.calls.length).toEqual(1);
        expect(spy.mock.calls[0][0]).toContain({markers: {one: 1}});
      });

      it('should place markers after yaml', async () => {
        // Given
        const order = [];
        const fakeAce = new FakeAce();
        fakeAce.setValue.andCall(() => order.push('setValue'));
        const spy = jest.fn().mockImplementation(() => order.push('placeMarkers'));
        rewiremock('brace').with(fakeAce);
        rewiremock('../editor-helpers/marker-placer').with({placeMarkerDecorations: spy});
        // const makeEditor = require("plugins/editor/components/editor.jsx").default
        const Editor = makeEditor({});
        const wrapper = shallow(
          <Editor value="original value" markers={{}} />
        );

        // When
        wrapper.find('ReactAce').shallow();
        await pause(EVENTUALLY);

        // Then
        expect(order).toEqual(['setValue', 'placeMarkers']);
      });


      it.skip(
        'should Test for markers being disabled/enabled during a yaml update',
        async function() {
          // Given
          const order = [];
          const fakeAce = new FakeAce();
          fakeAce.setValue.andCall(() => order.push('setValue'));
          const spy = jest.fn().mockImplementation(() => {
            order.push('placeMarkers');
            return () => order.push('removeMarkers');
          });
          rewiremock('brace').with(fakeAce);
          rewiremock('../editor-helpers/marker-placer').with({placeMarkerDecorations: spy});
          // const makeEditor = require("plugins/editor/components/editor.jsx").default
          const Editor = makeEditor({});
          const wrapper = shallow(
            <Editor value="original value" markers={{}} />
          );
          wrapper.find('ReactAce').shallow();

          // When
          wrapper.setProps({value: 'new value', origin: 'bob'});
          await pause(EVENTUALLY);

          // Then
          expect(order).toEqual(['setValue', 'placeMarkers', 'removeMarkers', 'setValue', 'placeMarkers']);
        }
      );

      it.skip(
        'should Test for markers being disabled/enabled during ctrl-z',
        async function() {
          // Given
          const order = [];
          const fakeAce = new FakeAce();
          fakeAce.setValue.andCall(() => order.push('setValue'));
          const spy = jest.fn().mockImplementation(() => {
            order.push('placeMarkers');
            return () => order.push('removeMarkers');
          });
          rewiremock('brace').with(fakeAce);
          rewiremock('../editor-helpers/marker-placer').with({placeMarkerDecorations: spy});
          // const makeEditor = require("plugins/editor/components/editor.jsx").default
          const Editor = makeEditor({});
          const wrapper = shallow(
            <Editor value="original value" markers={{}} />
          );
          wrapper.find('ReactAce').shallow();

          // When
          fakeAce.userUndo();
          await pause(EVENTUALLY);

          // Then
          expect(order).toEqual(['setValue', 'placeMarkers', 'removeMarkers', 'setValue', 'placeMarkers']);
        }
      );

    });
  });

});
