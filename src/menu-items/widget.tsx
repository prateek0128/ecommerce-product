// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { Story, Fatrows, PresentionChart } from 'iconsax-react';

// type
import { NavItemType } from 'types/menu';

// project-import
import { useGetMenu } from 'api/menu';

// assets
import { Refresh, Home3, HomeTrendUp, Box1 } from 'iconsax-react';

// icons
const icons = {
  widgets: Story,
  statistics: Story,
  data: Fatrows,
  chart: PresentionChart
};

// ==============================|| MENU ITEMS - WIDGETS ||============================== //

const widget: NavItemType = {
  id: 'group-widget',
  //title: <FormattedMessage id="widgets" />,
  //title: <FormattedMessage id=" " />,
  icon: icons.widgets,
  type: 'group',
  children: [
    {
      id: 'statistics',
      title: <FormattedMessage id="statistics" />,
      type: 'item',
      url: '/widget/statistics',
      icon: icons.statistics
    }
    // {
    //   id: 'data',
    //   title: <FormattedMessage id="data" />,
    //   type: 'item',
    //   url: '/widget/data',
    //   icon: icons.data
    // },
    // {
    //   id: 'chart',
    //   title: <FormattedMessage id="chart" />,
    //   type: 'item',
    //   url: '/widget/chart',
    //   icon: icons.chart
    // }
  ]
};

// ==============================|| MENU ITEMS - API ||============================== //

export function MenuFromAPIWidget() {
  const { menu, menuLoading } = useGetMenu();

  if (menuLoading) return widget;

  const subChildrenList = (children: NavItemType[]) => {
    return children?.map((subList: NavItemType) => {
      return fillItem(subList);
    });
  };

  const itemList = (subList: NavItemType) => {
    let list = fillItem(subList);

    // if collapsible item, we need to feel its children as well
    if (subList.type === 'collapse') {
      list.children = subChildrenList(subList.children!);
    }
    return list;
  };

  const childrenList: NavItemType[] | undefined = menu?.children?.map((subList: NavItemType) => {
    return itemList(subList);
  });

  let menuList = fillItem(menu, childrenList);
  return menuList;
}

function fillItem(item: NavItemType, children?: NavItemType[] | undefined) {
  return {
    ...item,
    title: <FormattedMessage id={`${item?.title}`} />,
    // @ts-ignore
    icon: icons[item?.icon],
    ...(children && { children })
  };
}
export default widget;
