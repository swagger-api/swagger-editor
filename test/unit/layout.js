import EditorLayout from 'src/layout';

describe('EditorLayout', () => {
  // Mock global.alert, aka window.alert
  global.alert = jest.fn();

  // Reset mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when file(s) are dropped', () => {
    describe('if one or more files are of an unexpected type', () => {
      it('should alert the user that their file(s) were rejected', () => {
        const editorLayout = new EditorLayout();

        editorLayout.onDrop([], ['rejected.file.1']);
        editorLayout.onDrop([], ['rejected.file.1', 'rejected.file.2']);

        expect(global.alert.mock.calls.length).toEqual(2);
        global.alert.mock.calls.forEach(call => {
          expect(call[0]).toMatch(/^Sorry.*/);
        });
      });
    });

    describe('if more than one file of an expected type is dropped', () => {
      it('should alert the user that their file(s) were rejected', () => {
        const editorLayout = new EditorLayout();

        editorLayout.onDrop(['accepted.file.1', 'accepted.file.2'], []);
        expect(global.alert.mock.calls.length).toEqual(1);
        expect(global.alert.mock.calls[0][0]).toMatch(/^Sorry.*/);
      });
    });

    describe('if exactly one file of an expected type is dropped', () => {
      it(
        'should call the updateSpec function passed in as props with the contents of the file',
        () => {
          const fileContents = 'This is my awesome file!';
          const props = {
            specActions: {
              updateSpec: jest.fn()
            }
          };

          jest.spyOn(global, 'FileReader')
            .mockImplementation(function () {
              this.readAsText = function () { this.onloadend(); };
              this.result = fileContents;
            });

          const editorLayout = new EditorLayout(props);

          editorLayout.onDrop(['accepted.file']);

          expect(props.specActions.updateSpec).toHaveBeenCalledWith(fileContents, 'fileDrop');
        }
      );
    });
  });

  describe('onChange', () => {
    it(
      'should call specActions.updateSpec with origin = editor by default',
      () => {
        // Given
        const spy = jest.fn();
        const props ={
          specActions: {
            updateSpec: spy
          }
        };
        const editorLayout = new EditorLayout(props);

        // When
        editorLayout.onChange('one: 1');

        // Then
        expect(spy.mock.calls.length).toEqual(1);
        expect(spy.mock.calls[0]).toEqual(['one: 1', 'editor']);
      }
    );

    it('should allow (onDrop) to override with different origin', () => {
      // Given
      const spy = jest.fn();
      const props ={
        specActions: {
          updateSpec: spy
        }
      };
      const editorLayout = new EditorLayout(props);

      // When
      editorLayout.onChange('one: 1', 'somethingElse');

      // Then
      expect(spy.mock.calls.length).toEqual(1);
      expect(spy.mock.calls[0]).toEqual(['one: 1', 'somethingElse']);
    });
  });
});
