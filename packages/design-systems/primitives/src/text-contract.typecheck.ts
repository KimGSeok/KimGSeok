import { colors } from '@kimgseok/design-tokens/colors';
import type { ComponentProps } from 'react';
import type { Heading, Text } from './web';

type TextProps = ComponentProps<typeof Text>;
type HeadingProps = ComponentProps<typeof Heading>;

const objectColor: TextProps = { children: '안전한 컬러 토큰', textStyle: 'text-l-medium', color: colors.red500 };
const stringColor: TextProps = { children: '안전한 컬러 토큰', textStyle: 'text-l-medium', color: 'red-500' };
const title: HeadingProps = { children: '제목', textStyle: 'title-xl-bold' };

// @ts-expect-error Color tokens use a lowercase, closed union.
const invalidColor: TextProps = { children: '잘못된 컬러 토큰', color: 'Red-500' };
// @ts-expect-error The size segment must stay inside xxs through xxl.
const invalidSize: TextProps = { children: '잘못된 크기 토큰', textStyle: 'text-xxxl-medium' };
// @ts-expect-error Heading only accepts title text styles.
const invalidHeading: HeadingProps = { children: '잘못된 제목 토큰', textStyle: 'text-xl-bold' };

void [objectColor, stringColor, title, invalidColor, invalidSize, invalidHeading];
