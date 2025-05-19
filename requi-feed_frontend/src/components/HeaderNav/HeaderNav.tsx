'use client';

import {
  ActionIcon,
  Avatar,
  Burger,
  Flex,
  Group,
  Indicator,
  MantineTheme,
  Menu,
  rem,
  Stack,
  Text,
  TextInput,
  Tooltip,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import {
  IconBell,
  IconCircleHalf2,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconMessageCircle,
  IconMoonStars,
  IconPower,
  IconSearch,
  IconSunHigh,
} from '@tabler/icons-react';
import { LanguagePicker } from '@/components';
import { upperFirst, useMediaQuery } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { borrarSesion } from '@/hooks/SessionUtil';
import { useRouter } from 'next/navigation';
import { PATH_AUTH } from '@/routes';

const ICON_SIZE = 20;


type HeaderNavProps = {
  mobileOpened?: boolean;
  toggleMobile?: () => void;
  desktopOpened?: boolean;
  toggleDesktop?: () => void;
};

const HeaderNav = (props: HeaderNavProps) => {
  const { desktopOpened, toggleDesktop, toggleMobile, mobileOpened } = props;
  const theme = useMantineTheme();
  const { setColorScheme, colorScheme } = useMantineColorScheme();
  const laptop_match = useMediaQuery('(max-width: 992px)');
  const tablet_match = useMediaQuery('(max-width: 768px)');
  const mobile_match = useMediaQuery('(max-width: 425px)');
  const  router  = useRouter();

  const handleColorSwitch = (mode: 'light' | 'dark' | 'auto') => {
    setColorScheme(mode);
    showNotification({
      title: `${upperFirst(mode)} is on`,
      message: `You just switched to ${
        colorScheme === 'dark' ? 'light' : 'dark'
      } mode. Hope you like it`,
      styles: (theme: MantineTheme) => ({
        root: {
          backgroundColor:
            colorScheme === 'dark'
              ? theme.colors.gray[7]
              : theme.colors.gray[2],
          borderColor:
            colorScheme === 'dark'
              ? theme.colors.gray[7]
              : theme.colors.gray[2],

          '&::before': {
            backgroundColor:
              colorScheme === 'dark'
                ? theme.colors.gray[2]
                : theme.colors.gray[7],
          },
        },

        title: {
          color:
            colorScheme === 'dark'
              ? theme.colors.gray[2]
              : theme.colors.gray[7],
        },
        description: {
          color:
            colorScheme === 'dark'
              ? theme.colors.gray[2]
              : theme.colors.gray[7],
        },
        closeButton: {
          color:
            colorScheme === 'dark'
              ? theme.colors.gray[2]
              : theme.colors.gray[7],
          '&:hover': {
            backgroundColor: theme.colors.red[5],
            color: theme.white,
          },
        },
      }),
    });
  };
  const handleLogout = () => {
    borrarSesion();
    router.push(PATH_AUTH.signin)
};
  

  return (
    <Group justify="space-between">
      <Group gap={0}>
        <Tooltip label="Toggle side navigation">
          <ActionIcon visibleFrom="md" onClick={toggleDesktop}>
            {desktopOpened ? (
              <IconLayoutSidebarLeftCollapse />
            ) : (
              <IconLayoutSidebarLeftExpand />
            )}
          </ActionIcon>
        </Tooltip>
        <Burger
          opened={mobileOpened}
          onClick={toggleMobile}
          hiddenFrom="md"
          size="sm"
        />
        {/*<Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="md" size="sm"/>*/}
        {!mobile_match && (
          <TextInput
            placeholder="search"
            rightSection={<IconSearch size={ICON_SIZE} />}
            ml="md"
            style={{ width: tablet_match ? 'auto' : rem(400) }}
          />
        )}
      </Group>
      <Group>
        {mobile_match && (
          <ActionIcon>
            <IconSearch size={ICON_SIZE} />
          </ActionIcon>
        )}
        <LanguagePicker type="collapsed" />
        
        <Tooltip label="Logout">
          <ActionIcon onClick={handleLogout}>
            <IconPower size={ICON_SIZE} />
          </ActionIcon>
        </Tooltip>
        <Menu shadow="lg" width={200}>
          <Menu.Target>
            <Tooltip label="Switch color modes">
              <ActionIcon variant="light">
                {colorScheme === 'auto' ? (
                  <IconCircleHalf2 size={ICON_SIZE} />
                ) : colorScheme === 'dark' ? (
                  <IconMoonStars size={ICON_SIZE} />
                ) : (
                  <IconSunHigh size={ICON_SIZE} />
                )}
              </ActionIcon>
            </Tooltip>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label tt="uppercase" ta="center" fw={600}>
              Select color modes
            </Menu.Label>
            <Menu.Item
              leftSection={<IconSunHigh size={16} />}
              onClick={() => setColorScheme('light')}
            >
              Light
            </Menu.Item>
            <Menu.Item
              leftSection={<IconMoonStars size={16} />}
              onClick={() => setColorScheme('dark')}
            >
              Dark
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Group>
  );
};

export default HeaderNav;
