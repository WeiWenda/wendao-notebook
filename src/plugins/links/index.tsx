import * as React from 'react'; // tslint:disable-line no-unused-variable
import {PluginApi, registerPlugin} from '../../ts/plugins';
import {Session, Document, Row, Mutation, api_utils, InMemorySession} from '../../share';
import {DatePicker, Dropdown, Image, Menu, MenuProps, message, Modal, Tag, Tooltip} from 'antd';
import {ExclamationCircleOutlined, LinkOutlined, PictureOutlined, CloudSyncOutlined} from '@ant-design/icons';
import {Logger} from '../../ts/logger';
import { getStyles } from '../../share/ts/themes';
import {pluginName as tagsPluginName, TagsPlugin} from '../tags';
import {DrawioViewer} from '../../components/drawioViewer';
import {HoverIconDropDownComponent} from './dropdownMenu';

type RowsToLinks = {[key: number]: String};
export class LinksPlugin {
    public api: PluginApi;
    private logger: Logger;
    private session: Session;
    private document: Document;
    private tagsPlugin: TagsPlugin;
    public SetLink!: new(row: Row, mark: String) => Mutation;
    public UnsetLink!: new(row: Row) => Mutation;
    constructor(api: PluginApi) {
        this.api = api;
        this.logger = this.api.logger;
        this.session = this.api.session;
        this.document = this.session.document;
        this.tagsPlugin = this.api.getPlugin(tagsPluginName) as TagsPlugin;
    }
    public async enable() {
        const that = this;
        class SetLink extends Mutation {
            private row: Row;
            private mark: String;

            constructor(row: Row, mark: String) {
                super();
                this.row = row;
                this.mark = mark;
            }
            public str() {
                return `row ${this.row}, mark ${this.mark}`;
            }
            public async mutate(/* session */) {
                await that._setLink(this.row, this.mark);
                await that.api.updatedDataForRender(this.row);
            }
            public async rewind(/* session */) {
                return [
                    new UnsetLink(this.row),
                ];
            }
        }
        this.SetLink = SetLink;
        class UnsetLink extends Mutation {
            private row: Row;
            private link: String | null | undefined = undefined;

            constructor(row: Row) {
                super();
                this.row = row;
            }
            public str() {
                return `row ${this.row}`;
            }
            public async mutate(/* session */) {
                this.link = await that.getLink(this.row);
                if (this.link !== null) {
                    await that._unsetLink(this.row);
                    await that.api.updatedDataForRender(this.row);
                }
            }
            public async rewind(/* session */) {
                if (this.link === undefined) {
                    throw new Error('Rewinding before mutating: UnsetMark');
                }
                if (this.link === null) {
                    return [];
                }
                return [
                    new SetLink(this.row, this.link),
                ];
            }
        }
        this.UnsetLink = UnsetLink;
        const onInsertDrawio = (row: Row) => {
            if (that.session.lockEdit) {
                return;
            }
            that.getXml(row).then(xml => {
                that.session.drawioModalVisible = true;
                that.session.drawioXml = xml;
                that.session.emit('updateAnyway');
            });
            that.session.drawioOnSave = (xml: string) => {
                that.setXml(row, xml).then(() => {
                    that.session.drawioXml = undefined;
                    that.session.emit('updateAnyway');
                });
            };
        };
        this.api.registerHook('session', 'renderHoverBullet', function(bullet, {path, rowInfo}) {
              return (
                <HoverIconDropDownComponent session={that.session} bullet={bullet} path={path} rowInfo={rowInfo}
                    tagsPlugin={that.tagsPlugin} linksPlugin={that} onInsertDrawio={onInsertDrawio} />
              );
          });
        this.api.registerHook('document', 'pluginRowContents', async (obj, { row }) => {
            const link = await this.getLink(row);
            const ids_to_pngs = await this.api.getData('ids_to_pngs', {});
            const png = ids_to_pngs[row] || null;
            const ids_to_xmls = await this.api.getData('ids_to_xmls', {});
            const xml = ids_to_xmls[row] || null;
            const ids_to_mds = await this.api.getData('ids_to_mds', {});
            const md = ids_to_mds[row] || null;
            obj.links = { link: link, png: png, xml: xml, md: md };
            return obj;
        });
        this.api.registerHook('document', 'serializeRow', async (struct, info) => {
            const link = await this.getLink(info.row);
            if (link) {
                struct.link = link;
            }
            const ids_to_pngs = await this.api.getData('ids_to_pngs', {});
            if (ids_to_pngs[info.row] != null) {
                struct.png = ids_to_pngs[info.row];
            }
            const ids_to_xmls = await this.api.getData('ids_to_xmls', {});
            if (ids_to_xmls[info.row] != null) {
                struct.drawio = ids_to_xmls[info.row];
            }
            const ids_to_mds = await this.api.getData('ids_to_mds', {});
            if (ids_to_mds[info.row] != null) {
                struct.md = ids_to_mds[info.row];
            }
            return struct;
        });
        this.api.registerListener('document', 'loadRow', async (path, serialized) => {
            if (serialized.link != null) {
                const err = await this.setLink(path.row, serialized.link);
                if (err) { return this.session.showMessage(err, {text_class: 'error'}); }
            }
            if (serialized.png != null) {
                await this.setPng(path.row, serialized.png.src, serialized.png.json);
            }
            if (serialized.drawio != null) {
                await this.setXml(path.row, serialized.drawio);
            }
            if (serialized.md != null) {
                await this.setMarkdown(path.row, serialized.md);
            }
        });
        this.api.registerHook('session', 'renderAfterLine', (elements, {path, pluginData}) => {
            if (pluginData.links?.xml != null) {
                elements.push(
                    <DrawioViewer key={'drawio'} session={that.session} row={path.row} content={pluginData.links.xml}
                       onClickFunc={onInsertDrawio}/>
                );
            }
            if (pluginData.links?.png != null) {
                const pngOnClick: MenuProps['onClick'] = ({ key }) => {
                    switch (key) {
                        case 'del_png':
                            Modal.confirm({
                                title: '确认删除当前思维导图？',
                                icon: <ExclamationCircleOutlined />,
                                okText: '确认',
                                cancelText: '取消',
                                onOk: () => {
                                    that.unsetPng(path.row).then(() => {
                                        that.session.emit('updateAnyway');
                                    });
                                }
                            });
                            break;
                        case 'edit_png':
                            that.session.pngModalVisible = true;
                            that.session.pngOnSave = (img_src: any, json: any) => {
                                that.setPng(path.row, img_src, json).then(() => {
                                    that.session.emit('updateAnyway');
                                });
                            };
                            setTimeout(() => {
                                that.getPng(path.row).then(kmnode => {
                                    that.session.mindMapRef.current.setContent(kmnode);
                                });
                            }, 1000);
                            that.session.emit('updateAnyway');
                            break;
                        default:
                            message.info(`Click on item ${key}`);
                    }
                };
                const pngMenu = <Menu
                  onClick={pngOnClick}
                  items={[{
                        key: 'edit_png',
                        label: '修改思维导图',
                    },
                    {
                        key: 'del_png',
                        label: '删除思维导图',
                    }]}
                  ></Menu>;
                elements.push(
                    <Dropdown key='mindmap-icon' overlay={pngMenu} trigger={['contextMenu']} >
                        <Tag icon={<PictureOutlined />}
                          onClick={() => pluginData.links.png.visible = true}
                          style={{
                              marginLeft: '10px',
                              ...getStyles(this.session.clientStore, ['theme-bg-secondary', 'theme-trim', 'theme-text-primary'])
                          }} >
                         脑图
                        </Tag>
                    </Dropdown>,
                    <Image
                        key='mindmap-preview'
                        style={{ display: 'none' }}
                        src={pluginData.links.png.src}
                        preview={{
                            visible: pluginData.links.png.visible,
                            src: pluginData.links.png.src,
                            onVisibleChange: value => {
                                pluginData.links.png.visible = value;
                                that.session.emit('updateAnyway');
                            }
                        }}
                    />
                );
            }
            if (pluginData.links?.link != null) {
                const linkOnClick: MenuProps['onClick'] = ({ key }) => {
                    switch (key) {
                        case 'del_link':
                            Modal.confirm({
                                title: '确认删除当前扩展阅读链接？',
                                icon: <ExclamationCircleOutlined />,
                                okText: '确认',
                                cancelText: '取消',
                                onOk: () => {
                                    that.setLink(path.row, null).then(() => {
                                        that.session.emit('updateAnyway');
                                    });
                                }
                            });
                            break;
                        case 'edit_link':
                            that.session.formSubmitAction = (value) => {
                                that.setLink(path.row, value).then(() => {
                                    that.session.emit('updateAnyway');
                                });
                            };
                            that.session.emit('updateAnyway');
                            break;
                        default:
                            message.info(`Click on item ${key}`);
                    }
                };
                const linkMenu = <Menu
                  onClick={linkOnClick}
                  items={[{
                          key: 'edit_link',
                          label: '修改链接',
                      },
                      {
                          key: 'del_link',
                          label: '取消链接',
                      }]}
                ></Menu>;
                elements.push(
                  <Dropdown overlay={linkMenu} trigger={['contextMenu']} >
                      <Tag key='link'
                           icon={<LinkOutlined />}
                           onClick={() => that.onClicked(pluginData.links.link)}
                           style={{
                               ...getStyles(this.session.clientStore, ['theme-bg-secondary', 'theme-trim', 'theme-text-primary'])
                           }} >
                          扩展阅读
                      </Tag>
                  </Dropdown>
                );
            }
            return elements;
        });
    }
    public async setLink(row: Row, mark: String | null) {
        if (mark) {
            await this.session.do(new this.SetLink(row, mark));
        } else {
            await this.session.do(new this.UnsetLink(row));
        }
        return null;
    }

    public async clearLinks() {
        await this.api.setData('ids_to_links', {});
        await this.api.setData('ids_to_pngs', {});
        await this.api.setData('ids_to_xmls', {});
        await this.api.setData('ids_to_mds', {});
    }

    public async getPng(row: Row): Promise<any> {
        const ids_to_pngs = await this.api.getData('ids_to_pngs', {});
        return ids_to_pngs[row].json;
    }
    public async getMarkdown(row: Row): Promise<any> {
        const ids_to_mds = await this.api.getData('ids_to_mds', {});
        return ids_to_mds[row];
    }

    public async setMarkdown(row: Row, xml: String): Promise<String | null> {
        const ids_to_mds = await this.api.getData('ids_to_mds', {});
        ids_to_mds[row] = xml;
        await this.api.setData('ids_to_mds', ids_to_mds);
        await this.api.updatedDataForRender(row);
        return null;
    }
    public async getXml(row: Row): Promise<any> {
        const ids_to_xmls = await this.api.getData('ids_to_xmls', {});
        return ids_to_xmls[row];
    }

    public async setXml(row: Row, xml: String): Promise<String | null> {
        const ids_to_xmls = await this.api.getData('ids_to_xmls', {});
        ids_to_xmls[row] = xml;
        await this.api.setData('ids_to_xmls', ids_to_xmls);
        await this.api.updatedDataForRender(row);
        return null;
    }

    public async setPng(row: Row, src: String, json: any): Promise<String | null> {
        const ids_to_pngs = await this.api.getData('ids_to_pngs', {});
        ids_to_pngs[row] = {src: src, json: json};
        await this.api.setData('ids_to_pngs', ids_to_pngs);
        await this.api.updatedDataForRender(row);
        return null;
    }

    public async unsetPng(row: Row) {
        const ids_to_pngs = await this.api.getData('ids_to_pngs', {});
        delete ids_to_pngs[row];
        await this.api.setData('ids_to_pngs', ids_to_pngs);
        await this.api.updatedDataForRender(row);
    }

    public async getLink(row: Row): Promise<String | null> {
        const marks = await this._getRowsToLinks();
        return marks[row] || null;
    }
    private async _getRowsToLinks(): Promise<RowsToLinks> {
        return await this.api.getData('ids_to_links', {});
    }
    private async _setLink(row: Row, mark: String) {
        const rows_to_marks = await this._getRowsToLinks();
        rows_to_marks[row] = mark;
        await this.api.setData('ids_to_links', rows_to_marks);
    }
    private async _unsetLink(row: Row) {
        const rows_to_marks = await this._getRowsToLinks();
        delete rows_to_marks[row];
        await this.api.setData('ids_to_links', rows_to_marks);
    }
    private onClicked(url: string) {
        // route to new page by changing window.location
        window.open(url, '_blank'); // to open new page
    }
}
export const linksPluginName = 'Links';
registerPlugin<LinksPlugin>(
  {
    name: linksPluginName,
    author: 'WeiWenda',
    description: (
      <div>
       允许每个节点增加一个http外链，用于提供pdf、ppt、wiki。
      </div>
    ),
    dependencies: [tagsPluginName],
  },
    async function(api) {
      const linksPlugin = new LinksPlugin(api);
      await linksPlugin.enable();
      return linksPlugin;
  },
  (api => api.deregisterAll()),
);
