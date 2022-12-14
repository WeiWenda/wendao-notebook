import {DocInfo, DocVersion, Modes, Path, Session, SessionComponent, SpinnerComponent} from '../../share';
import {Popover, Radio, Space, Input} from 'antd';
import {HistoryOutlined, LeftOutlined, LockOutlined, RightOutlined, StarFilled, StarOutlined, UnlockOutlined} from '@ant-design/icons';
import BreadcrumbsComponent from '../breadcrumbs';
import LayoutToolsComponent from '../layoutTools';
import {getDocContent, getDocVersions} from '../../share/ts/utils/APIUtils';
import Moment from 'moment/moment';
import FileToolsComponent from '../fileTools';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {MarksPlugin} from '../../plugins/marks';
import {default as FileSearch} from '../../share/ts/search';
import {mimetypeLookup} from '../../ts/util';
const {Search} = Input;

export function SessionWithToolbarComponent(props: {session: Session, loading: boolean, filterOuter: string,
  showLayoutIcon: boolean,
  showLockIcon: boolean,
  beforeLoadDoc?: () => Promise<void>,
  afterLoadDoc?: () => Promise<void>
  curDocInfo?: DocInfo,
  markPlugin?: MarksPlugin,
  onEditBaseInfo?: (info: DocInfo) => void}) {
  const [isMarked, setMarked] = useState(false);
  const [isRoot, setIsRoot] = useState(props.session.viewRoot.isRoot());
  const [filterInner, setFilterInner] = useState('');
  const [versions, setVersions] = useState(new Array<DocVersion>());
  const [currentVersion, setCurrentVersion] = useState('');
  const [crumbContents, setCrumbContents] = useState(() => {
    const initialCrumbContents: {[row: number]: string} = {};
    return initialCrumbContents;
  });
  const onCrumbClick = async (path: Path) => {
    const session = props.session;
    await session.zoomInto(path);
    session.save();
    session.emit('updateInner');
  };
  const textColor = props.session.clientStore.getClientSetting('theme-text-primary');
  const selectStyle = `opacity(100%) drop-shadow(0 0 0 ${textColor}) brightness(10)`;
  const unselectStyle = `opacity(10%) drop-shadow(0 0 0 ${textColor})`;
  function useForceUpdate() {
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value + 1); // update state to force render
  }
  const forceUpdate = useForceUpdate();
  const applyFilterInner = (filterContent: string) => {
    if (filterContent) {
      if (!props.session.search) {
        props.session.search = new FileSearch(async (query) => {
          const results = await props.session.document.search(props.session.viewRoot, query);
          console.log(results);
          return {
            rows: new Set(results.flatMap(({path}) => {
              return path.getAncestry();
            })),
            accentMap: new Map(results.map(result => [result.path.row, result.matches]))
          };
        }, props.session);
      }
      props.session.search?.update(filterContent);
    } else {
      props.session.search = null;
    }
  };
  const onSearchContent = (searchContent: string) => {
    setFilterInner(searchContent);
    applyFilterInner(searchContent);
  };
  useEffect(() => {
    setFilterInner(props.filterOuter);
    applyFilterInner(props.filterOuter);
  }, [props.filterOuter]);
  useEffect(() => {
    props.session.on('changeViewRoot', async (path: Path) => {
      setIsRoot(path.isRoot());
      if (props.markPlugin) {
        const markInfo = await props.markPlugin.getMark(path.row);
        if (markInfo) {
          setMarked(true);
        } else {
          setMarked(false);
        }
      }
      const newCrumbContents: {[row: number]: string} = {};
      while (path.parent != null) {
        path = path.parent;
        newCrumbContents[path.row] = await props.session.document.getText(path.row);
      }
      setCrumbContents(newCrumbContents);
    });
    props.session.replaceListener('save-cloud', (info) => {
      props.session.showMessage('????????????');
      props.session.userDocs = props.session.userDocs.map(doc => {
        if (doc.id === info.docId) {
          doc.dirtyUpdate = false;
        }
        return {...doc};
      });
    });
  }, []);
  return (
    <div style={{flexGrow: 1, overflow: 'auto'}}>
      {
        props.loading &&
        <SpinnerComponent/>
      }
      {
        !props.loading &&
        <div className='file-toolbar' style={{
          borderColor: props.session.clientStore.getClientSetting('theme-bg-secondary')
        }}>
          <Space style={{paddingLeft: '10px'}}>
            <LeftOutlined
              onClick={() => {
                props.session.jumpPrevious();
              }}
              style={{
                filter:  props.session.jumpIndex === 0 ? unselectStyle : selectStyle
              }}/>
            <RightOutlined
              onClick={() => {
                props.session.jumpNext();
              }}
              style={{
                filter: (props.session.jumpIndex + 1 >= props.session.jumpHistory.length ) ? unselectStyle : selectStyle
              }}/>
            <BreadcrumbsComponent key='crumbs'
                                  session={props.session}
                                  viewRoot={props.session.viewRoot}
                                  onCrumbClick={onCrumbClick}
                                  crumbContents={crumbContents}/>
          </Space>
          <Space>
            {
              props.session.vimMode &&
              <span style={{fontSize: 12, float: 'right', paddingRight: '20px'}}>
                {'-- ' +  Modes.getMode(props.session.mode).name + ' --'}
              </span>
            }
            <Search
              size='small'
              placeholder='????????????'
              allowClear
              value={filterInner}
              onChange={(e) => onSearchContent(e.target.value)}
              onPressEnter={(e: any) => {onSearchContent(e.target.value); }}
              onFocus={() => {props.session.stopMonitor = true; } }
              onBlur={() => {props.session.stopMonitor = false; } }/>
            {
              props.showLayoutIcon &&
              <LayoutToolsComponent session={props.session} />
            }
            {
              props.session.lockEdit && props.showLayoutIcon &&
              <LockOutlined onClick={() => {
                props.session.lockEdit = false;
                props.session.showMessage('??????????????????');
                forceUpdate();
              }}/>
            }
            {
              !props.session.lockEdit && props.showLockIcon &&
              <UnlockOutlined onClick={() => {
                props.session.lockEdit = true;
                props.session.showMessage('??????????????????');
                forceUpdate();
              }} />
            }
            {
              isMarked && !isRoot && props.markPlugin &&
              <StarFilled onClick={() => {
                props.markPlugin!.setMark(props.session.viewRoot.row, '').then(() => {
                  setMarked(false);
                });
              }} />
            }
            {
              !isMarked && !isRoot && props.markPlugin &&
              <StarOutlined onClick={() => {
                props.session.document.getText(props.session.viewRoot.row).then(text => {
                  props.markPlugin!.setMark(props.session.viewRoot.row, text).then(() => {
                    setMarked(true);
                  });
                });
              }}/>
            }
            {
              props.curDocInfo && props.beforeLoadDoc && props.afterLoadDoc &&
                <Popover placement='bottom' content={
                  <div style={{width: '200px', maxHeight: '100px', overflowY: 'auto'}}>
                    <Radio.Group onChange={(v) => {
                      setCurrentVersion(v.target.value);
                      getDocContent(props.curDocInfo!.id!, v.target.value).then((res) => {
                        props.session.showMessage('???????????????...');
                        props.beforeLoadDoc!().then(() => {
                          props.session.reloadContent(res.content, mimetypeLookup(props.curDocInfo!.name!)).then(() => {
                            props.afterLoadDoc!().then(() => {
                              props.session.showMessage('??????????????????');
                            });
                          });
                        });
                      });
                    }} value={currentVersion}>
                      <Space direction='vertical'>
                        {
                          versions.map(version => {
                            return (
                              <Radio value={version.commitId}>
                                {Moment.unix(version.time).format('yyyy-MM-DD HH:mm:ss')}
                              </Radio>
                            );
                          })
                        }
                      </Space>
                    </Radio.Group>
                  </div>
                }
                         trigger='click'
                         onOpenChange={(open) => {
                           if (open) {
                             getDocVersions(props.curDocInfo!.id!).then(res => setVersions(res));
                           }
                         }}>
                  <HistoryOutlined />
                </Popover>
            }
            <FileToolsComponent session={props.session} curDocId={props.curDocInfo?.id}
                                onEditBaseInfo={() => {
                                  if (props.onEditBaseInfo && props.curDocInfo) {
                                    props.onEditBaseInfo(props.curDocInfo);
                                  }
                                }}
                                reloadFunc={(operationType: string) => {
                                  if (operationType === 'remove') {
                                    forceUpdate();
                                  }
                                }}/>
          </Space>
        </div>
      }
      {
        !props.loading &&
        <SessionComponent ref={props.session.sessionRef} session={props.session} />
      }
    </div>
  );
}
