import PropTypes from 'prop-types';
import { SplitPane } from 'react-collapse-pane';

const Layout = ({ getComponent, useSwaggerEditorReactModal, useSplashScreen }) => {
  const EditorPane = getComponent('EditorPane', true);
  const EditorPreviewPane = getComponent('EditorPreviewPane', true);
  const TopBar = getComponent('TopBar', true);
  const Container = getComponent('Container'); // accessed from swagger-ui`
  const Dropzone = getComponent('Dropzone', true);
  const SplashScreen = getComponent('SplashScreen', true);
  const ref = useSwaggerEditorReactModal();
  const [canDisplaySplashScreen, canDisplayLayout] = useSplashScreen();

  return (
    <div className="swagger-editor__layout" ref={ref}>
      <SplashScreen isOpen={canDisplaySplashScreen} />
      {canDisplayLayout && (
        <>
          <TopBar />
          <Container className="container">
            <Dropzone>
              <SplitPane split="vertical">
                <EditorPane />
                <EditorPreviewPane />
              </SplitPane>
            </Dropzone>
          </Container>
        </>
      )}
    </div>
  );
};

Layout.propTypes = {
  getComponent: PropTypes.func.isRequired,
  useSwaggerEditorReactModal: PropTypes.func.isRequired,
  useSplashScreen: PropTypes.func.isRequired,
};

export default Layout;
