// @ts-ignore: JSX/MDX with Stencil
import docs from './modus-side-navigation-storybook-docs.mdx';
import { html } from 'lit-html';
import { withActions } from '@storybook/addon-actions/decorator';
import { useEffect } from '@storybook/preview-api';



export default {
  title: 'Components/Side Navigation',
  argTypes: {
    collapseOnClickOutside: {
      name: 'collapse-on-click-outside',
      description: 'To choose whether to collapse the panel when clicked outside',
      table: {
        type: { summary: 'boolean' },
      },
    },
    data: {
      description: 'Data property to create the side navigation items',
      table: {
        type: { summary: 'ModusSideNavigationItemInfo' },
      },
    },
    maxWidth: {
      name: 'max-width',
      description: 'Maximum width of the side navigation panel in an expanded state',
      table: {
        defaultValue: { summary: '256px' },
        type: { summary: 'string' },
      },
    },
    mode: {
      options: ['overlay', 'push'],
      type: 'select',
      description:
        'Mode to make side navigation either overlay or push the content for the selector specified in `targetContent`',
      table: {
        defaultValue: { summary: `'overlay'` },
        type: {
          summary: `'overlay' | 'push'` },
      },
    },
    expanded: {
      description: 'The expanded state of side navigation panel and items',
      table: {
        type: { summary: 'boolean' },
      },
    },
    targetContent: {
      name: 'target-content',
      description:
        "Specify the selector for the page's content for which paddings and margins will be set by side navigation based on the `mode`",
      table: {
        type: { summary: 'string' },
      },
    },
  },
  parameters: {
    docs: {
      page: docs,
    },
    options: {
      isToolshown: true,
    },
    actions: {
      handles: ['sideNavExpand', 'sideNavItemClicked', 'mainMenuClick'],
    },
    controls: { expanded: true, sort: 'requiredFirst' },
    viewMode: 'docs',
  },
  decorators: [
    withActions,
    (Story) => {
      useEffect(() => {
        const handleHelpOpen = () => {
          const panel = document.querySelector('modus-side-navigation');
          if (panel) {
            const isExpanded = panel.getAttribute('expanded') === 'true';
            panel.setAttribute('expanded', (!isExpanded).toString());
          }
        };
        const blueTheme = `--modus-side-navigation-link-color:#ffffff;--modus-side-navigation-bg:#0e416c;--modus-side-navigation-item-color:#ffffff;--modus-side-navigation-item-active-bg:#217cbb;--modus-side-navigation-item-hover-bg:#0063a3;--modus-side-navigation-item-icon-color:#ffffff;--modus-side-navigation-item-chevron-color:#ffffff;--modus-side-navigation-item-icon-filter:invert(100%) sepia(0%) saturate(24%) hue-rotate(114deg) brightness(108%) contrast(108%);`;
        const sideNav = document.querySelector('modus-side-navigation');
        const switchTheme = () => {
          const switchTheme = document.querySelector('#switch-theme');
          if (switchTheme.checked) {
            sideNav.style = blueTheme ;
          }
          else{
          sideNav.style = '';
          }
        }
        const switchMode = () => {
          const switchMode = document.querySelector('#switch-mode');

          if (switchMode.checked) {
            sideNav.mode = sideNav.mode === 'push' ? 'overlay' : 'push';
          }
        };
        document.addEventListener('switchClick', switchMode);
        document.addEventListener('switchClick', switchTheme);
        document.addEventListener('mainMenuClick', handleHelpOpen);

        Array.from(document.querySelectorAll('modus-side-navigation-item')).forEach(item => {
          item.addEventListener('sideNavItemClicked', (e) => {
            executeListener(e, () => {
              const panel = document.querySelector('#panelcontent');
              document.querySelector('#sidenav-content-title')?.remove();
              const el = document.createElement('h3');
              el.id = "sidenav-content-title";
              el.innerHTML = document.querySelector(`#${e.detail.id}`)?.label || "Home page";
              panel.insertBefore(el, document.querySelector('#overview'));
            });
          });
        });

        const initialize = () => {
          const sidenav = document.querySelector('#dataTemplate #sideNav');
          sidenav.data = [
            {
              id: 'home-menu',
              menuIcon: 'home',
              label: 'Home page 1',
              children: [
                {
                  id: 'home-menu-2',
                  menuIcon: 'home',
                  label: 'Home page 2',
                  onSideNavItemClicked: (e) => {
                    executeListener(e, () => {
                      if (e.detail) {
                        const panel = document.querySelector('#panelcontent');
                        document.querySelector('#sidenav-content-title')?.remove();
                        const el = document.createElement('h3');
                        el.id = 'sidenav-content-title';
                        el.innerHTML = e.target?.label || 'Home page';
                        panel.insertBefore(el, document.querySelector('#overview'));
                      }
                    });
                  },
                },
                {
                  id: 'usage-menu-2',
                  children: [
                    {
                      id: 'home-menu-3',
                      menuIcon: 'home',
                      label: 'Home page 3',
                      onSideNavItemClicked: (e) => {
                        executeListener(e, () => {
                          if (e.detail) {
                            const panel = document.querySelector('#panelcontent');
                            document.querySelector('#sidenav-content-title')?.remove();
                            const el = document.createElement('h3');
                            el.id = 'sidenav-content-title';
                            el.innerHTML = e.target?.label || 'Home page';
                            panel.insertBefore(el, document.querySelector('#overview'));
                          }
                        });
                      },
                    },
                  ],
                  menuIcon: 'flowchart',
                  label: 'Usage page 2',
                },
              ],
            },
            {
              id: 'usage-menu',
              menuIcon: 'flowchart',
              label: 'Usage page 1',
              onSideNavItemClicked: (e) => {
                executeListener(e, () => {
                  if (e.detail) {
                    const panel = document.querySelector('#panelcontent');
                    document.querySelector('#sidenav-content-title')?.remove();
                    const el = document.createElement('h3');
                    el.id = 'sidenav-content-title';
                    el.innerHTML = e.target?.label || 'Home page';
                    panel.insertBefore(el, document.querySelector('#overview'));
                  }
                });
              },
            },
            {
              id: 'styles-menu',
              menuIcon: 'bar_graph_line',
              label: 'Styles page 1',
              onSideNavItemClicked: (e) => {
                executeListener(e, () => {
                  if (e.detail) {
                    const panel = document.querySelector('#panelcontent');
                    document.querySelector('#sidenav-content-title')?.remove();
                    const el = document.createElement('h3');
                    el.id = 'sidenav-content-title';
                    el.innerHTML = e.target?.label || 'Home page';
                    panel.insertBefore(el, document.querySelector('#overview'));
                  }
                });
              },
            },
            {
              id: 'accessibility-menu',
              menuIcon: 'screen',
              label: 'Accessibility page 1',
              onSideNavItemClicked: (e) => {
                executeListener(e, () => {
                  if (e.detail) {
                    const panel = document.querySelector('#panelcontent');
                    document.querySelector('#sidenav-content-title')?.remove();
                    const el = document.createElement('h3');
                    el.id = 'sidenav-content-title';
                    el.innerHTML = e.target?.label || 'Home page';
                    panel.insertBefore(el, document.querySelector('#overview'));
                  }
                });
              },
            },
          ];
        };
        const sidenav = document.querySelector('#dataTemplate #sideNav');
        if(sidenav){
        initialize();
        }
        return () => {
          document.removeEventListener('switchClick', switchMode);
          document.removeEventListener('switchClick', switchTheme);
          document.removeEventListener('mainMenuClick', handleHelpOpen);
          document.removeEventListener('mainMenuClick', handleHelpOpen);
          Array.from(document.querySelectorAll('modus-side-navigation-item')).forEach(item => {
            item.removeEventListener('sideNavItemClicked', handleHelpOpen);
          });
        };
      }, []);
      return Story();
    },
  ],
};

const DefaultTemplate = ({ collapseOnClickOutside, maxWidth, mode, expanded, targetContent }) => html`
  <div id="defaultTemplate">
    <div
      style="width: 100%; align-items: center; height: 56px; box-shadow: 0 0 2px var(--modus-secondary)!important; margin-top: 50px;">
      <modus-navbar id="navbar" show-apps-menu show-help show-main-menu show-notifications> </modus-navbar>
    </div>

    <div
      id="container"
      style="display: flex; min-height: 500px; overflow-y: auto; position: relative; box-shadow: 0 0 2px var(--modus-secondary)!important;">
      <modus-side-navigation
        max-width=${maxWidth}
        id="sideNav"
        collapse-on-click-outside=${collapseOnClickOutside}
        mode=${mode}
        expanded=${expanded}
        target-content=${targetContent}>
        <modus-side-navigation-item id="home-menu" label="Home page">
          <modus-icon name="home" size="24" slot="menu-icon"></modus-icon>
        </modus-side-navigation-item>
        <modus-side-navigation-item id="usage-menu" label="Usage">
          <modus-icon name="flowchart" size="24" slot="menu-icon"></modus-icon>
        </modus-side-navigation-item>
        <modus-side-navigation-item id="styles-menu" label="Styles">
          <modus-icon name="bar_graph_line" size="24" slot="menu-icon"></modus-icon>
        </modus-side-navigation-item>
        <modus-side-navigation-item id="accessibility-menu" label="Accessibility">
          <modus-icon name="screen" size="24" slot="menu-icon"></modus-icon>
        </modus-side-navigation-item>
      </modus-side-navigation>

      <div id="panelcontent" style="padding: 10px;">
        <div id="overview">
          <p>
            The side navigation of an application provides context through accessible menu options and positions a consistent
            component to connect to various pages in the application.
          </p>
          <p>
            The side navigation is a collapsible side content of the site’s pages. It is located alongside the page’s primary
            content. The component is designed to add side content to a fullscreen application. It is activated through the
            “hamburger” menu in the Navbar.
          </p>
        </div>
      </div>
    </div>
  </div>
`;
export const Default = DefaultTemplate.bind({});
Default.args = {
  collapseOnClickOutside: true,
  maxWidth: '300px',
  mode: 'overlay',
  expanded: false,
  targetContent: '#defaultTemplate #panelcontent',
};

const SideNavigationWithDataTemplate = ({ collapseOnClickOutside, maxWidth, mode, expanded, targetContent }) => html`
  <div id="dataTemplate">
    <modus-switch id="switch-theme" label="Enable blue theme"></modus-switch>
    <br />
    <modus-switch id="switch-mode" label="Enable Push Side Navigation"></modus-switch>
    <div
      style="width: 100%;align-items: center;height: 56px;box-shadow: 0 0 2px var(--modus-secondary)!important; margin-top: 10px;">
      <modus-navbar id="navbar" show-apps-menu show-help show-main-menu show-notifications> </modus-navbar>
    </div>

    <div
      id="container"
      style="display:flex; min-height:500px; overflow-y: auto; position: relative;box-shadow: 0 0 2px var(--modus-secondary)!important;">
      <modus-side-navigation
        max-width=${maxWidth}
        id="sideNav"
        collapse-on-click-outside=${collapseOnClickOutside}
        mode=${mode}
        expanded=${expanded}
        target-content=${targetContent}>
      </modus-side-navigation>

      <div id="panelcontent" style="padding:10px; transition: all 0.25s linear 0s;">
        <div id="overview">
          <p>
            The side navigation of an application provides context through accessible menu options and positions a consistent
            component to connect to various pages in the application.
          </p>
          <p>
            The side navigation is a collapsible side content of the site’s pages. It is located alongside the page’s primary
            content. The component is designed to add side content to a fullscreen application. It is activated through the
            “hamburger” menu in the Navbar.
          </p>
        </div>
      </div>
    </div>
  </div>
`;

export const SideNavigationWithData = (args) => {
  const { collapseOnClickOutside, maxWidth, mode, expanded, targetContent } = args;

  // Decorator pattern applied here to dynamically configure the component properties
  return SideNavigationWithDataTemplate({
    collapseOnClickOutside,
    maxWidth: maxWidth || '300px',  // Defaulting to '300px' if not provided
    mode: mode || 'overlay',        // Default to 'overlay' mode if not provided
    expanded: expanded !== undefined ? expanded : true, // Default to expanded if not provided
    targetContent: targetContent || '#dataTemplate #panelcontent', // Default target content selector
  });
};

SideNavigationWithData.args = {
  collapseOnClickOutside: true,
  maxWidth: '300px',
  mode: 'overlay',
  expanded: true,
  targetContent: '#dataTemplate #panelcontent',
};




