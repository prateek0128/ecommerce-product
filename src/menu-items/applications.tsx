// third-party
import { FormattedMessage } from 'react-intl';

// project-imports
import { handlerCustomerDialog } from 'api/customer';
import { NavActionType } from 'config';

// assets
import { Add, Link1, KyberNetwork, Messages2, Calendar1, Kanban, Profile2User, Bill, UserSquare, ShoppingBag } from 'iconsax-react';

// type
import { NavItemType } from 'types/menu';
import InventoryIcon from '@mui/icons-material/Inventory';
import BugReportIcon from '@mui/icons-material/BugReport';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import EngineeringIcon from '@mui/icons-material/Engineering';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
// icons
const icons = {
  applications: KyberNetwork,
  chat: Messages2,
  calendar: Calendar1,
  kanban: Kanban,
  customer: Profile2User,
  invoice: Bill,
  profile: UserSquare,
  ecommerce: ShoppingBag,
  add: Add,
  link: Link1
};

// ==============================|| MENU ITEMS - APPLICATIONS ||============================== //

const applications: NavItemType = {
  id: 'group-applications',
  //  title: <FormattedMessage id="applications" />,
  title: <FormattedMessage id=" " />,
  icon: icons.applications,
  type: 'group',
  children: [
    {
      id: 'profile',
      title: <FormattedMessage id="profile" />,
      // type: 'collapse',
      type: 'item',
      icon: icons.profile,
      url: '/apps/profiles/account/personal'
      // children: [
      //   {
      //     id: 'user-profile',
      //     title: <FormattedMessage id="user-profile" />,
      //     type: 'item',
      //     link: '/apps/profiles/user/:tab',
      //     url: '/apps/profiles/user/personal',
      //     breadcrumbs: false
      //   },
      //   {
      //     id: 'account-profile',
      //     title: <FormattedMessage id="account-profile" />,
      //     type: 'item',
      //     url: '/apps/profiles/account/basic',
      //     link: '/apps/profiles/account/:tab',
      //     breadcrumbs: false
      //   }
      // ]
    },
    // {
    //   id: 'kanban',
    //   title: <FormattedMessage id="kanban" />,
    //   type: 'item',
    //   icon: icons.kanban,
    //   url: '/apps/kanban/board',
    //   link: '/apps/kanban/:tab',
    //   breadcrumbs: false
    // },
    {
      id: 'customer',
      title: <FormattedMessage id="Customers" />,
      // type: 'collapse',
      type: 'item',
      icon: icons.customer,
      url: '/apps/customer/customer-list',
      breadcrumbs: true
      // children: [
      //   {
      //     id: 'customer-list',
      //     title: <FormattedMessage id="list" />,
      //     type: 'item',
      //     url: '/apps/customer/customer-list',
      //     actions: [
      //       {
      //         type: NavActionType.FUNCTION,
      //         label: 'Add Customer',
      //         function: () => handlerCustomerDialog(true),
      //         icon: icons.add
      //       }
      //     ]
      //   }
      //   // {
      //   //   id: 'customer-card',
      //   //   title: <FormattedMessage id="cards" />,
      //   //   type: 'item',
      //   //   url: '/apps/customer/customer-card'
      //   // }
      // ]
    },
    {
      id: 'invoice',
      title: <FormattedMessage id="invoice" />,
      url: '/apps/invoice/dashboard',
      type: 'collapse',
      icon: icons.invoice,
      breadcrumbs: false,
      children: [
        {
          id: 'create',
          title: <FormattedMessage id="create" />,
          type: 'item',
          url: '/apps/invoice/create',
          breadcrumbs: false
        },
        // {
        //   id: 'details',
        //   title: <FormattedMessage id="details" />,
        //   type: 'item',
        //   url: '/apps/invoice/details/1',
        //   link: '/apps/invoice/details/:id',
        //   breadcrumbs: false
        // },
        {
          id: 'list',
          title: <FormattedMessage id="list" />,
          type: 'item',
          url: '/apps/invoice/list',
          breadcrumbs: false
        }
        // {
        //   id: 'edit',
        //   title: <FormattedMessage id="edit" />,
        //   type: 'item',
        //   url: '/apps/invoice/edit/1',
        //   link: '/apps/invoice/edit/:id',
        //   breadcrumbs: false
        // }
      ]
    },
    {
      id: 'e-commerce',
      title: <FormattedMessage id="Products" />,
      // type: 'collapse',
      type: 'item',
      // icon: icons.ecommerce,
      icon: InventoryIcon,
      url: '/apps/e-commerce/product-list',
      breadcrumbs: false
      // children: [
      //   // {
      //   //   id: 'products',
      //   //   title: <FormattedMessage id="products" />,
      //   //   type: 'item',
      //   //   url: '/apps/e-commerce/products'
      //   // },
      //   // {
      //   //   id: 'product-details',
      //   //   title: <FormattedMessage id="product-details" />,
      //   //   type: 'item',
      //   //   link: '/apps/e-commerce/product-details/:id',
      //   //   url: '/apps/e-commerce/product-details/1',
      //   //   breadcrumbs: false
      //   // },
      //   {
      //     id: 'product-list',
      //     title: <FormattedMessage id="product-list" />,
      //     type: 'item',
      //     url: '/apps/e-commerce/product-list',
      //     breadcrumbs: false
      //   }
      //   // {
      //   //   id: 'add-new-product',
      //   //   title: <FormattedMessage id="add-new-product" />,
      //   //   type: 'item',
      //   //   url: '/apps/e-commerce/add-new-product'
      //   // }
      //   // {
      //   //   id: 'checkout',
      //   //   title: <FormattedMessage id="checkout" />,
      //   //   type: 'item',
      //   //   url: '/apps/e-commerce/checkout'
      //   // }
      // ]
    },
    {
      id: 'repairParts',
      title: <FormattedMessage id="Repair Parts" />,
      type: 'collapse',
      //icon: icons.ecommerce,
      icon: HomeRepairServiceIcon,
      children: [
        {
          id: 'assignedRepairParts',
          title: <FormattedMessage id="Assigned Repair Parts" />,
          type: 'item',
          link: '/apps/repairParts/assignedRepairPartsList',
          url: '/apps/repairParts/assignedRepairPartsList'
        },
        {
          id: 'assignRepairParts',
          title: <FormattedMessage id="Assign Repair Parts" />,
          type: 'item',
          link: '/apps/repairParts/assignRepairParts',
          url: '/apps/repairParts/assignRepairParts',
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'technician',
      title: <FormattedMessage id="Technicians" />,
      // type: 'collapse',
      type: 'item',
      // icon: icons.customer,
      icon: EngineeringIcon,
      url: '/apps/technician/technician-list',
      breadcrumbs: true
      // children: [
      //   {
      //     id: 'technician-list',
      //     title: <FormattedMessage id="list" />,
      //     type: 'item',
      //     url: '/apps/technician/technician-list',
      //     actions: [
      //       {
      //         type: NavActionType.FUNCTION,
      //         label: 'Add Technician',
      //         function: () => handlerCustomerDialog(true),
      //         icon: icons.add
      //       }
      //     ]
      //   }
      //   // {
      //   //   id: 'technician-card',
      //   //   title: <FormattedMessage id="cards" />,
      //   //   type: 'item',
      //   //   url: '/apps/technician/technician-card'
      //   // }
      // ]
    },
    {
      id: 'complaints',
      title: <FormattedMessage id="Complaints" />,
      // type: 'collapse',
      type: 'item',
      //icon: icons.customer,
      icon: ReportProblemIcon,
      url: '/apps/complaint/complaints-list',
      breadcrumbs: false
      // children: [
      //   {
      //     id: 'complaint-list',
      //     title: <FormattedMessage id="Complaint List" />,
      //     type: 'item',
      //     url: '/apps/complaint/complaint-list'
      //   },
      //   {
      //     id: 'raise-complaint',
      //     title: <FormattedMessage id="Raise Complaint" />,
      //     type: 'item',
      //     url: '/apps/complaint/raise-complaint'
      //   }
      // ]
    }
    // {
    //   id: 'chat',
    //   title: <FormattedMessage id="chat" />,
    //   type: 'item',
    //   url: '/apps/chat',
    //   icon: icons.chat,
    //   breadcrumbs: false
    // },
    // {
    //   id: 'calendar',
    //   title: <FormattedMessage id="calendar" />,
    //   type: 'item',
    //   url: '/apps/calendar',
    //   icon: icons.calendar
    //   // actions: [
    //   //   {
    //   //     type: NavActionType.LINK,
    //   //     label: 'Full Calendar',
    //   //     icon: icons.link,
    //   //     url: 'https://fullcalendar.io/docs/react',
    //   //     target: true
    //   //   }
    //   // ]
    // }
  ]
};

export default applications;
