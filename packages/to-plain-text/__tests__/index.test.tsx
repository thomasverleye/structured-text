import {
  render,
  StructuredTextGraphQlResponse,
  RenderError,
  renderRule,
} from '../src';
import { isHeading } from 'datocms-structured-text-utils';

describe('render', () => {
  describe('with no value', () => {
    it('renders null', () => {
      expect(render(null)).toMatchSnapshot();
    });
  });

  describe('simple dast with no links/blocks', () => {
    const structuredText: StructuredTextGraphQlResponse = {
      value: {
        schema: 'dast',
        document: {
          type: 'root',
          children: [
            {
              type: 'heading',
              level: 1,
              children: [
                {
                  type: 'span',
                  value: 'This\nis a\ntitle!',
                },
              ],
            },
          ],
        },
      },
    };

    describe('with default rules', () => {
      it('renders the document', () => {
        expect(render(structuredText)).toMatchSnapshot();
      });
    });

    describe('with custom rules', () => {
      it('renders the document', () => {
        expect(
          render(structuredText, {
            renderText: (text) => {
              return text.replace(/This/, 'That');
            },
            customRules: [
              renderRule(
                isHeading,
                ({ node, children, adapter: { renderFragment } }) => {
                  return renderFragment([
                    `Heading ${node.level}:`,
                    ...children,
                  ]);
                },
              ),
            ],
          }),
        ).toMatchSnapshot();
      });
    });
  });

  describe('with links/blocks', () => {
    type QuoteRecord = {
      id: string;
      __typename: 'QuoteRecord';
      quote: string;
      author: string;
    };

    type DocPageRecord = {
      id: string;
      __typename: 'DocPageRecord';
      slug: string;
      title: string;
    };

    const structuredText: StructuredTextGraphQlResponse<
      QuoteRecord | DocPageRecord
    > = {
      value: {
        schema: 'dast',
        document: {
          type: 'root',
          children: [
            {
              type: 'heading',
              level: 1,
              children: [
                {
                  type: 'span',
                  value: 'This is a',
                },
                {
                  type: 'span',
                  marks: ['highlight'],
                  value: 'title',
                },
                {
                  type: 'inlineItem',
                  item: '123',
                },
                {
                  type: 'itemLink',
                  item: '123',
                  children: [{ type: 'span', value: 'here!' }],
                },
              ],
            },
            {
              type: 'block',
              item: '456',
            },
          ],
        },
      },
      blocks: [
        {
          id: '456',
          __typename: 'QuoteRecord',
          quote: 'Foo bar.',
          author: 'Mark Smith',
        },
      ],
      links: [
        {
          id: '123',
          __typename: 'DocPageRecord',
          title: 'How to code',
          slug: 'how-to-code',
        },
      ],
    };

    describe('with default rules', () => {
      it('renders the document', () => {
        expect(
          render(structuredText, {
            renderInlineRecord: ({ record }) => {
              switch (record.__typename) {
                case 'DocPageRecord':
                  return record.title;
                default:
                  return null;
              }
            },
            renderLinkToRecord: ({ record, children }) => {
              switch (record.__typename) {
                case 'DocPageRecord':
                  return children;
                default:
                  return null;
              }
            },
            renderBlock: ({ record }) => {
              switch (record.__typename) {
                case 'QuoteRecord':
                  return `${record.quote} — ${record.author}`;
                default:
                  return null;
              }
            },
          }),
        ).toMatchSnapshot();
      });
    });

    describe('with missing renderInlineRecord', () => {
      it('skips the node', () => {
        expect(render(structuredText)).toMatchSnapshot();
      });
    });

    describe('with missing record and renderInlineRecord specified', () => {
      it('raises an error', () => {
        expect(() => {
          render(
            { ...structuredText, links: [] },
            {
              renderInlineRecord: () => null,
              renderLinkToRecord: () => null,
              renderBlock: () => null,
            },
          );
        }).toThrow(RenderError);
      });
    });
  });
});
