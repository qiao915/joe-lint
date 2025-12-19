import React from 'react';
import { hashHistory } from 'react-router';
import { Progress, Button, DatePicker, Message, Dialog, Balloon } from 'aop-ui';
import './index.scss';
import $ from 'jquery';
import app, { fromClassName } from '../../../../common/config.jsx';
import Loading from '../../../../common/components/showLoading/showLoading';
import PlatformName from '../../../../common/components/platformName/index.jsx';
import { MyShopListRequest, MyShopSimpleListRequest, OrderListV2Request, triggerSync, getSyncStatus, getLastSyncTime, OrderTagsListRequest } from '../../../../common/api.js';
import TableNavChange from '../../../../common/components/tableNavChange';
import ChangeProductsModule from '../../../../common/components/changeProductsModule/index';
import ShowModal from '../../../../common/components/showModal/index.jsx';
import Paginations from '../../../../common/components/paginations';
import ShowBoxLoading from '../../../../common/components/showBoxLoading/index.jsx';
import utils from '../../../../common/utils';
import CountdownTimerBySecond  from '../../../../common/components/countdownTime/index.jsx';
import SkuMappingsModule from '../../../../common/components/skuMappingsModule/index.jsx';
import ChangeProductsModuleV2 from '../../../../common/components/changeProductsModuleV2/index.jsx';
import SingleCheckSkuModule from '../../../../common/components/singleCheckSkuModule/index.jsx';
import MultiProductSkuMappingModule from '../../../../common/components/multiProductSkuMappingModule/index.jsx';
import { batchDistributionRequest, productRequest, purchaseOrderRequest,GetXiaoDianSupplierList,CancelXiaoDianPurchaseOrder, ConfirmGoodsXiaoDianPurchaseOrder } from '../../../../common/api.js';
import { debounceOther } from '../../../../common/config.jsx';
import SelectShoPBox from '../../../../common/components/selectShoPBox';
import BatchModule from '../batchModule/index.jsx'
import TagType from '../tagType/index.jsx';

class OrderList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModal: false,
      isCancelPrivateDomain: false,
      supplierList: [],
      orderStatus: [
        { id: 0, value: "", title: "待发货", active: true, num: 0 },
        { id: 1, value: "", title: "已发货", active: false, num: 0 },
        { id: 2, value: "", title: "交易完成", active: false, num: 0 },
        { id: 3, value: "", title: "交易关闭", active: false, num: 0 },
        { id: 4, value: "", title: "退款中", active: false, num: 0 },
        { id: 5, value: "", title: "忽略订单", active: false, num: 0 },
      ],
      orderStatusIndex: 0,
      sourcePlatformList: [
        { id: 1, value: "", title: "全部订单", number: "",isHide:false, active: true },
        { id: 2, value: "AlibabaZhuKe", title: "已关联货源", number: "0",isHide:false, active: false },
        // { id: 3, value: "TaoteZhuKe", title: "非1688货源", number: "0",isHide:false, active: false },
        { id: 3, value: "no_relation", title: "未关联货源", number: "0",isHide:false, active: false },
      ],
      purchaseOrderStatusList: [
        { id: 0, value: "", title: "全部", number: -1, active: false },
        { id: 1, value: "waitpurchase", title: "待采购", number: 0, active: true },
        { id: 2, value: "waitbuyerpay", title: "待付款", number: -1, active: false },
        { id: 3, value: "waitsellersend", title: "待发货", number: -1, active: false }
      ],
      purchaseOrderStatusIndex: 1,

      //===================================店铺相关=====================================
      isAuthShop: false,//当前店铺已经授权过期
      shopList: [],//店铺列表
      shopListByFull: [],//当前页面，获取一次完整的店铺列表
      selectShopId: null,
      newSelectShopId:null,//店铺选择组件，选择中店铺id
      newSelectShopName:null,//店铺选择组件，选择中店铺id
      selectShopPlatformType: null,
      //===================================订单相关=====================================
      orderList: [],//订单
      orderListDto: {//查询订单请求参数
        OrderStatus: 'waitsellersend',//订单状态
      },

      //==================================分页相关======================================
      current: 1,//页码
      totals: 0,//总记录数
      pagesize: 30,//页数
      isShowProductMappingOnload: false,//未匹配到规格，显示设置

      //=================================加载框=======================================
      isLoading: false,
      loadingTitle: '加载店铺信息...',

      showTaoteFooter: true,//点击非1688货源订单展示是否展示底部通知

      //=================================同步功能相关=======================================
      sysncOrderStatusTaskProgress: 100,//同步进度
      lastSyncTimeByShop: '',//最后同步时间，店铺的维度



      notGenerateRetureOrderItem:1,
      selectProduct: null,//未匹配 --映射默认获取的商品信息
      supplierProductSkuList: [],//未匹配 --映射默认供应商sku信息

      selectOrderList: [],//选择的平台订单
      selectPurchaseOrderList: [],//选择的订单，对应的采购单
      isIgnoreLimitExpressly:0,//是否忽略明文解密，继续操作，1是忽略
      isShowModalBynotCategory: false,//提示是否设置规格
      isShowModalBynotCategoryDouble: false,//提示是否设置规格弹窗New,可以未映射，按已映射的下单
      notCategoryList: [],//未匹配的规格数据。
      notCategoryListQu: [],//未匹配的规格数据(去重，没有code)。
      notCategoryListTitle: "",
      notSetProductList: [],//未设置规格，查询的商品列表
      isShowCommonError: false,
      showCommonErrorMessage: '',
      mapListByOrderList:[],//部分映射的订单列表，用于忽略，部分下单
      isShowModalByCreateOrderError: false,
      createOrderError: [],

      encryFialdDialogByZhongZhuan: false,//抖音中转地址，没有开启密文提示弹


      //获取付款方式，提示
      isShowModalBySelectPayment: false,
      showModalByPaymentPaymentMoney: 0,
      isShowAutoPayButton: false,//是否开通了自动代扣

      //获取【付款方式】错误，提示
      isShowModalBySelectPaymentError: false,
      getPaymentErrorFaildOrderList: [],
      getPaymentErrorNotWaitPayIds: [],
      getPaymentErrorPayChannelsList: [],

      isShowModalByPayUrl: false,//手动支付后，弹窗提示是否操作完成


      //获取手动支付，【付款链接】错误，提示
      isShowModalByPayUrlError: false,
      getPayUrlErrorFaildOrderList: [],
      getPayUrlErrorPayChannelsList: [],

      //自动代扣失败，提示
      isShowModalByAutoPaymentError: false,
      //自动代扣成功，提示
      isShowModalByAutoPaymentSuccess: false,
      autoPaymentSuccessPayingOrderIds: [],
      autoPaymentSuccessNotWaitPayIds: [],
      autoPaymentSuccessFaildOrderIds: [],


      //取消订单跳转后，弹出确认是否需要刷新数据
      isShowModalByCancelExamine: false,

      isShowMoreTypePay: false,//多种支付类型弹窗
      aliPayOrderCodeList: [],//阿里采购单支付列表（多支付类型时使用）
      taoTePayOrderCodeList: [],//淘特采购单支付列表（多支付类型时使用）


      isShowWaiSendTopCount: false,//是否显示待发货的数量。（列表查询初始化，通过这个开关不显示。有其他的方法统计）
      noEncryptLinkDialog:false,
      encryptLinkPlatforms:[
        //{ id: 0, value: "Taobao", title: "淘宝",link:"" },
        //{ id: 1, value: "Pinduoduo", title: "拼多多" ,link:"https://mms.pinduoduo.com/orders/reportManage"},
        { id: 2, value: "KuaiShou", title: "快手" ,link:"https://s.kwaixiaodian.com/zone/supplychain/privacy"},
        { id: 3, value: "TouTiao", title: "头条",link:"https://fxg.jinritemai.com/ffa/morder/order/receiver-info-manage" },
        //{ id: 4, value: "XiaoHongShu", title: "小红书",link:"" }
        ],
      tagEnum: {//订单标记集合
        KsRiskOrder: {
          tagName: "风控订单",
          tagClass: 'danger_tag',
          clickContent: this.ksRiskOrderTagClickContent,
        },
        PddRiskOrder: {
          tagName: "风控订单",
          tagClass: 'danger_tag',
          clickContent: this.pddRiskOrderTagClickContent,
        },
        KsPriorityDeliveryr: {
          tagName: "优先发货",
          tagClass: 'warning_tag',
        },
        KsSpecialRefundPriceProtectTag: {
          tagName: "价保",
          tagClass: 'warning_tag',
        },
        KsSpecialRefundGroupTag: {
          tagName: "万人团",
          tagClass: 'warning_tag',
        },
        PddShipHold: {
          tagName: "暂停发货",
          clickContent: this.pddShipHoldTagClickContent,
          tagClass: 'warning_tag',
        },
        KsRemindShipmentSignTag: {
          tagName: "催发货",
          predicate: (order, tag) => { return order.SellerOrder.PlatformStatus == 'waitsellersend' },
          clickContent: (order, tag) => { return <div>催发货时间： {tag.TagValue}</div> },
          tagClass: 'warning_tag',
        },
        OrderAddressUpdate: {
          tagName: "地址变更",
          style: { zIndex: "10000", maxWidth: "680px" },
          clickContent: this.ksAddressUpdate,
          tagClass: 'warning_tag',
        },
        OrderReceiverUpdate: {
          tagName: "地址变更",
          style: { zIndex: "10000", maxWidth: "680px" },
          clickContent: this.ksAddressUpdate,
          tagClass: 'warning_tag',
        },
        TouTiaoLogisticsTransitTag: {
          tagName: "偏远中转",
          style: { zIndex: "10000", maxWidth: "680px" },
          clickContent: this.orderLogisticsTransit,
          tagClass: 'warning_tag',
        },
        TouTiaoRemoteDerictTag: {
          tagName: "偏远直邮",
          style: { zIndex: "10000", maxWidth: "680px" },
          clickContent: this.orderLogisticsTransit,
          tagClass: 'danger_tag',
        },
        TouTiaoRemoteDerictTag:{
          tagName:"偏远直邮",
          style:{zIndex:"10000",maxWidth:"680px"},
          tagClass:'warning_tag',
        },
        KsLogisticsTransitTag: {
          tagName: "中转订单",
          style: { zIndex: "10000", maxWidth: "680px" },
          clickContent: this.orderKsLogisticsTransit,
          tagClass: 'warning_tag',
        },
        KsShunfengTag:{
          tagName: "顺丰包邮",
          style: { zIndex: "10000", maxWidth: "680px" },
          clickContent: this.orderKsShunfeng,
          tagClass: 'warning_tag',
        },
        KsRecommonedShunfengTag:{
          tagName: "推荐使用顺丰发货",
          style: { zIndex: "10000", maxWidth: "680px" },
          clickContent: this.orderKsRecommonedShunfeng,
          tagClass: 'warning_tag',
        },
        PddHomeDeliveryDoorTag: {
          tagName: "送货上门",
          style: { zIndex: "10000", maxWidth: "680px" },
          clickContent: this.orderPddHomeDeliveryDoor,
          tagClass: 'warning_tag',
        }
        ,
        XiaoHongShuHomeDeliveryTag: {
          tagName: "送货上门",
          style: { zIndex: "10000", maxWidth: "680px" },
          clickContent: this.orderXiaoHongShuHomeDelivery,
          tagClass: 'warning_tag',
        },
        PddDirectMailActivityTag: {
          tagName: "直邮活动",
          style: { zIndex: "10000", maxWidth: "680px" },
          clickContent: this.orderPddDirectMailActivity,
          tagClass: 'warning_tag',
        },
        TouTiaoChooseDeliveryTag: {
          tagName: "自选快递",
          clickContent: this.orderTouTiaoChooseDelivery,
          tagClass: 'danger_tag',
        },
        PddLocalDepotTag: {
          tagName: "本地仓订单",
          clickContent:this.orderPddLocalDepotActivity,
          tagClass: 'danger_tag',
        },
        WeixinPresentTag: {
          tagName: "礼物",
          style: { zIndex: "10000", maxWidth: "680px" },
          clickContent: this.orderWeixinPresent,
          tagClass: 'danger_tag',
        },
        
      },
      purchaseTagEnum: {
        OrderAddressUpdate: {
          tagName: "地址变更",
          style: { zIndex: "10000", maxWidth: "600px" },
          tagClass: 'warning_tag',
        },
        OrderReceiverUpdate: {
          tagName: "地址变更",
          style: { zIndex: "10000", maxWidth: "680px" },
          tagClass: 'warning_tag',
        }
      },
      allOrderSendChangeAddressDialog:false,
      //同步相关逻辑
      changeSearchSyncOrderNavs: [
        { id: 0, value: "", title: "同步店铺订单", active: true, },
        { id: 1, value: "", title: "同步1688订单", active: false, },
      ],
      isSyncOrderModal: false,
      syncOrderActiveId: 0,
      //是否店铺显示倒计时
      isShowSyncOrderShopCdt: false,
      //倒计时时间
      syncOrderShopCdtSeconds: 0,
      syncOrderShopCdtTime: 0,
      //是否店铺1688显示倒计时
      isShowSyncOrderShopAlibabaCdt: false,
      syncShopCheckTime: 0,
      //倒计时时间
      syncOrderShopAlibabaCdtSeconds: 0,
      syncOrderShopAlibabaCdtTime: '',
      sysncAlibabaOrderStatusTaskProgress: 100,//同步进度
      isTip: false

    };

    let shopId = undefined
    if (props.location && props.location && props.location.state) {
      shopId = props.location.state.shopId
    }
    if (props.location.state!=undefined&&'outAliParams' in props.location.state) {
      // 'myParam' 存在于 this.props.state 中
      shopId=props.location.state.outAliParams.shopCode;
    }



    try {
      const json = localStorage.getItem('orderList_footer_taote_click');
      const orderList_footer_taote_click = JSON.parse(json);
      const showTaoteFooter = (Date.now() - parseInt(orderList_footer_taote_click.timestamp) - 86400000) > 0;
      this.state.showTaoteFooter = showTaoteFooter;
    } catch (e) {

    }

    setTimeout(() => {
      this.loadShopList(shopId);
      $("#waitingSendExportId").css({ display: "flex" });
      $("#sendErrorByLeftId").css({ display: "none" });
      $("#exportByRightId").css({ display: "none" });
    }, 0);
  }

  componentDidMount() {
    this.loadSupplierList();

  }

  loadSupplierList = () => {
    // supplierList
    GetXiaoDianSupplierList().then((res) => {
      if (res.Success) {
        this.setState({ supplierList: res.Data })
      }
    });
    
  }

  //#region 订单列表查询 （折叠）
  //获取店铺列表（简要数据）
  async loadShopList(shopId) {
    this.state.isLoading = true
    this.setState({});
    const res = await MyShopSimpleListRequest();
    //this.setState({ isLoading: false });
    if (!res.Success) {
      this.setState({ isLoading: false });
      app.MessageShow('error', "获取店铺列表错误：" + res.Message);
      return;
    }
    var listData = res.Data.DataList.Shops || [];

    if(listData.length==0){
      this.setState({ isLoading: false });
      return;
    }
    
    if (listData.length > 0) {
      let current = listData.find(x => x.Id == shopId);
      if (!current) {
        current = listData.find(x => x.IsDefault == true);//没有指定店铺，就按默认的
        if (!current)//没有默认的，就获取第一个
          current = listData[0]
      }

      if (current) {
        current.IsSelected = true
        this.setState({ 
          shopList: listData,
          newSelectShopId:current.Id,
          newSelectShopName:current.ShopName,
          selectShopPlatformType:current.PlatformType
        }, () => {
          this.loadList(current.Id)//获取订单列表信息
          this.syncOrderByStatus(); //获取用户（订单）同步情况。
          //this.syncAlibabaOrderByStatus(); //获取店铺（订单）同步情况。
          this.initializeTig();
        });
      } else
        this.setState({ isLoading: false });

    }

  }
  //获取订单
  async loadList(shopId) {
    if (shopId == undefined || shopId == 0)
      shopId = this.state.newSelectShopId;


    if (shopId == "" || shopId == null || shopId == undefined) {
      this.setState({ isLoading: false });
      app.MessageShow('notice', "请选择店铺！", 2000);
      return;
    }
   
    //2023-12-05之后，目前只获取一次
    var isShopListByFull = false;
    if (this.state.shopListByFull.length == 0)//超时等没获取到，再次获取
    {
      setTimeout(() => {
        this.loadShopListByFull();
      }, 1000);
      isShopListByFull = true;
    }

    var isAuth = this.shopIsAuthEnd();
    if (isAuth == true) {
      //没有弹窗时，显示弹窗,同时没有获取完整的时候（因为获取完整的时候，会异步弹窗一次），避免弹窗两次
      if (isShopListByFull == false && this.state.isShowAuth != true)
        this.setState({ isShowAuth: true });

      this.setState({ isLoading: false, isAuthShop: true, orderList: [] });
      return;
    } else
      this.setState({ isAuthShop: false });


    var shopName = this.state.newSelectShopName;


    this.clearData();//清除所有弹出数据
    this.orderListCheckboxClose();
    const dto = this.loadOrderData(shopId);
    this.setState({ loadingTitle: '加载订单列表...' });
    var res = await OrderListV2Request(dto);
    this.setState({ isLoading: false, loadingTitle: '' });
    if (res.RequestError == true)//请求失效了。isLoading关闭看需求写
          return;
    var orderStatusList = this.state.orderStatus;
    var purchaseOrderStatusList=this.state.purchaseOrderStatusList;
    if (res.Success) {
      var orderList = res.Data.Orders || [];
      var totals = res.Data.TotalCount;

      this.loadOrderTags(res.Data.Orders, shopId);
      this.getLogisticsInfo(res.Data.Orders);
      
      if (totals == 0)
        this.state.isNotList = true;
      else
        this.state.isNotList = false;
      var shopName = this.state.newSelectShopName;
      var orderStatusIndex = this.state.orderStatusIndex;
      for (let i = 0; i < orderList.length; i++) {
        orderList[i].ShopName = shopName;
        orderList[i].SellerOrder.LastShipTimeValue = "";

        if (app.isNotNull(orderList[i].SellerOrder.LastShipTime) && orderStatusIndex == 0) {
          var nowTime = new Date().getTime();
          var LastTime = new Date(orderList[i].SellerOrder.LastShipTime).getTime();
          var LastShipTime = LastTime - nowTime;

          if (LastShipTime < 43200000)//小于12小时都标红色
            orderList[i].SellerOrder.LastShipTimeIsRed = true;
          if (LastShipTime > 0)
            orderList[i].SellerOrder.LastShipTimeValue = app.millisecondToDate(LastShipTime);
          else {
            orderList[i].SellerOrder.LastShipTimeValue = "已超时 " + app.millisecondToDate(-LastShipTime);
            orderList[i].SellerOrder.LastShipTimeIsEnd = true;
          }
        }
        for (let orderItem of orderList[i].SellerOrder.OrderItems) {
          orderItem.PlatformType = orderList[i].SellerOrder.PlatformType
          orderItem.OrderCode = orderList[i].SellerOrder.OrderCode
        }
      }
      if (this.state.isShowWaiSendTopCount == true && this.state.orderStatusIndex != 0)
        orderStatusList.find(x => x.active == true).num = totals;

      if(this.state.orderStatusIndex == 0)
      {
        //{ id: 1, value: "waitpurchase", title: "待采购", number: "0", active: true },
        purchaseOrderStatusList.forEach(x => {
          if(x.active ==true)
             x.number=totals;
          else 
             x.number=-1;
        })
      }
      
      this.setState({ 
        orderList: orderList, 
        totals: totals, 
        orderStatus: orderStatusList,
        purchaseOrderStatusList:purchaseOrderStatusList }, 
        () => {
        const orderId = $("#orderListInputOrderId").val();
        if (this.state.isShowWaiSendTopCount == false && orderId =="")
          this.loadWaitSendByTopNumberShow();
      });
    } else {
      app.MessageShow('error', "订单列表错误：" + res.Message);
      this.setState({ orderList: [], totals: 0 });
    }
  }


  //店铺列表（完整的列表数据），
  async loadShopListByFull() {

    const res = await MyShopListRequest();
    if (res.RequestError == true) {//请求失效了。isLoading关闭看需求写
      return;
    }

    if (res.Success) {
      var listData = res.Data.DataList.Shops;
      if (listData == null || listData == undefined)
        listData = [];

      // var shopList=this.state.shopList;
      // for (let i = 0; i < listData.length; i++) {
      //   for (let j = 0; j < shopList.length; j++) {
      //     if(listData[i].Id == shopList[j].Id)
      //     {
      //       shopList[j].AuthUrl=listData[i].AuthUrl;
      //       shopList[j].PayUrl=listData[i].PayUrl;
      //     }
      //   }
      // }

      this.setState({ shopListByFull: listData }, () => {
        var isAuth = this.shopIsAuthEnd();
        if (isAuth && this.state.isShowAuth != true)
          this.setState({ isShowAuth: true ,isAuthShop: true, orderList: []});
        //app.MessageShow('error', "检测到当前选择的店铺，授权已过期，请去店铺列表操作！");
      });
    }
  }


  //点击查询按钮
  search() {
    this.setState({ isLoading: true, current: 1 }, () => {
      this.loadList();
    })
  }
  orderListCheckboxClose = () => {
    $("#orderList_table tr input[type=checkbox]").prop('checked', false);


    $("#allCheck_id_Below").prop("checked", false);//下面的按钮点击
    $("#allCheck_id_Above").prop("checked", false);//上面的按钮点击
  }
  orderInputOnClick = () => {
    var orderId = $("#orderListInputOrderId").val();
    if (app.isNotNull(orderId)) {
      $("#supplierWangWangInputId").attr("disabled", "disabled");
      $("#orderProductByTypeInputeId").attr("disabled", "disabled");
    } else {
      $("#supplierWangWangInputId").removeAttr('disabled');
      $("#orderProductByTypeInputeId").removeAttr('disabled');
    }
  }
  loadOrderData(shopid) {
    const dto = {};
    if (shopid == undefined || shopid == 0)
      shopid = this.state.newSelectShopId;

    const dayas = $("#selectChooseDateId").val();
    const selectShopPlatformType = this.state.selectShopPlatformType;
    const wangwang = $("#supplierWangWangInputId").val();//供应商旺旺
    const orderId = $("#orderListInputOrderId").val();
    const OrderType = $("#OrderType").val();
    const PurchaseOrderType = $("#PurchaseOrderType").val() || 0;

    const orderStatusList = this.state.orderStatus;
    const indexs = orderStatusList.find(x => x.active == true).id;
    const sourcePlatformStatus = this.state.sourcePlatformList.find(x => x.active).value;

    if (indexs == 0)//待确认
    {
      dto.OrderStatus = "waitsellersend";
      dto.OrderSubState = this.state.orderSubstate;
    } else if (indexs == 1) {
      dto.OrderStatus = "waitbuyerreceive";
      dto.OrderSubState = ''
    } else if (indexs == 2) {
      dto.OrderStatus = "success";
      dto.OrderSubState = ''
    }
    else if (indexs == 3) {
      dto.OrderStatus = "cancel";
      dto.OrderSubState = ''
    }
    else if (indexs == 4) {
      dto.OrderStatus = "wait_seller_agree";
      dto.OrderSubState = ''
    }
    else if (indexs == 5) {
      dto.OrderStatus = "ignore";
      dto.OrderSubState = ''
    }

    const orderBySort = $("#orderBySortId").val();//排序
    let orderBy = "desc";
    if (orderBySort != "desc")
      orderBy = "asc";

    const orderProductByType = $("#orderProductByTypeId").val();
    if (orderProductByType == "ProductID")
      dto.ProductID = $("#orderProductByTypeInputeId").val();//商品id
    else
      dto.ProductSubject = $("#orderProductByTypeInputeId").val();//商品标题

    dto.OrderBy = orderBy;
    dto.PlatformOrderId = orderId;
    dto.PageIndex = this.state.current;
    dto.PageSize = this.state.pagesize;
    dto.SystemVersions = "pc";
    dto.SupplierWangWang = wangwang;
    dto.PlatformType = selectShopPlatformType;
    dto.Days = dayas;
    dto.ShopId = "" + shopid + "";
    dto.SourcePlatformStatus = sourcePlatformStatus;
    dto.PurchaseOrderStatus = this.state.purchaseOrderStatusList.find(x => x.active).value;
    dto.PurchaseOrderType = PurchaseOrderType;
    dto.OrderType = OrderType;

    if(indexs == 3){
      if (this.state.refundType == "noRefund")
        dto.PurchaseOrderStatus = "purchase_no_refund";
      else if (this.state.refundType == "refund")
        dto.PurchaseOrderStatus = "purchase_refund";
    }
    return dto;
  }

  searchTradingclose = (e, refundType) => {
    this.setState({
      refundType,
      current: 1, isLoading: true
    }, () => {
      this.loadList();
    })

  }
  //#endregion


  //#region  平台单显示

  clickOrderSubStatus(orderSubStatus, checked) {
    var checkList = $("input[name='checkboxNameByOrderStatus']");
    for (let i = 0; i < checkList.length; i++) {
      var ck = $(checkList[i]);
      if (ck.val() == orderSubStatus)
        ck.prop({ checked: checked });
      else
        ck.prop({ checked: false });
    }
    this.state.orderSubstate = checked ? orderSubStatus : '';
    this.setState({ isLoading: true }, () => { this.loadList() })
  }
   //子状态查询
   substateByCheckbox = (types) => {
    var isTrue = $("#" + types + "_checkboxId").is(':checked');
    var checkList = $("input[name='checkboxNameByOrderStatus']");
    for (let i = 0; i < checkList.length; i++) {
      var ck = $(checkList[i]);
      if (ck.val() == types) {
        ck.prop({ checked: isTrue });
      }
      else
        ck.prop({ checked: false });
    }
    if (!isTrue)
      types = "";
    this.setState({ isLoading: true, current: 1, refundType: "", orderSubstate: types }, () => {
      this.loadList();
    });

  }

  copyText = (text) => {
    var textareaC = document.createElement('textarea');
    textareaC.setAttribute('readonly', 'readonly'); //设置只读属性防止手机上弹出软键盘
    textareaC.value = text;
    document.body.appendChild(textareaC); //将textarea添加为body子元素
    textareaC.select();
    var res = document.execCommand('copy');
    document.body.removeChild(textareaC);//移除DOM元素
    app.MessageShow('notice', "复制成功", 1000);
  }
  sellerOrderRender(item) {
    const { SellerOrder } = item;
    return (
      <tr>
        <td colspan="2" className="orderTables-headerTd">
          <div className="orderTables-header" style={{ backgroundColor: "#fff9f0" }}>
            <div className="orderTables-header-left">
              <div className="orderTables-header-left-item">
                <span>订单编号：<i className="mainColor" id={"Order" + SellerOrder.PlatformOrderId}>{SellerOrder.PlatformOrderId}</i><span className='iconfont icon-fuzhi1' onClick={() => this.copyText(SellerOrder.PlatformOrderId)}></span></span>
                <span>付款时间：<i className="mainColor">{SellerOrder.PayTime}</i></span>
              </div>
              <div className="orderTables-header-left-item">
                <span>买家昵称：<i className="mainColor">{SellerOrder.BuyerWangWang}</i></span>
                {
                  SellerOrder.LastShipTimeIsRed == true && SellerOrder.LastShipTimeValue != "" && SellerOrder.IsShipHold != true ?
                    <div className='lastShipTimeWrap orderTables-header-left-timeWrap'>
                      <i className='iconfont icon-jishi' style={{ color: "#ff511c" }}></i>
                      <span className='lastShipTimeValue' style={{ color: "#ff511c" }}>{SellerOrder.LastShipTimeValue}</span>
                      {SellerOrder.LastShipTimeIsEnd != true ? <span>后将逾期发货</span> : null}
                    </div>
                    : null
                }
                {
                  SellerOrder.LastShipTimeIsRed != true && SellerOrder.LastShipTimeValue != "" && SellerOrder.IsShipHold != true ?
                    <div className='lastShipTimeWrap orderTables-header-left-timeWrap'>
                      <span className='lastShipTimeValue'>{SellerOrder.LastShipTimeValue}</span>
                      {SellerOrder.LastShipTimeIsEnd != true ? <span>后将逾期发货</span> : null}
                    </div>
                    : null
                }
              </div>
            </div>
            <div className='orderTables-header-right'>
              <PlatformName platformType={SellerOrder.PlatformType} isHidePatformName={true} />
              <span class="mainColor" style={{ marginLeft: "3px" }}>{item.ShopName}</span>
            </div>
          </div>
        </td>
      </tr>
    )
  }
  //平台订单商品列表页面
  sellerOrderItemRender = (item, itemSellerSkuList, index, sellerOrderLength) => {
    return (
      <tr style={{ padding: "1px 5px" }} className={index > 1 ? "hideTr tr" + index : "tr" + index}>
        <td style={{ width: "360px" }}>
          <div class="productShow">
            <div class="productShow-imgWrap">
              <img src={itemSellerSkuList.ProductImgUrl} alt="" />

              {itemSellerSkuList.IsFenXiao == false && itemSellerSkuList.IsTerminateProxy != true ?
                <span class="product-status warnBackColor">未分销</span>
                : null
              }
              {itemSellerSkuList.IsFenXiao == true && itemSellerSkuList.RefundStatus != "" && itemSellerSkuList.RefundStatus != null && itemSellerSkuList.RefundStatus != "REFUND_SUCCESS" && itemSellerSkuList.RefundStatus != "REFUND_CLOSE" ?
                <span class="product-status warnBackColor">退款中</span>
                : null
              }
              {itemSellerSkuList.IsFenXiao == true && itemSellerSkuList.RefundStatus != "" && itemSellerSkuList.RefundStatus != null && itemSellerSkuList.RefundStatus == "REFUND_SUCCESS" ?
                <span class="product-status warnBackColor">退款完成</span>
                : null
              }
              {itemSellerSkuList.IsFenXiao == true && (itemSellerSkuList.RefundStatus == "" || itemSellerSkuList.RefundStatus == null || itemSellerSkuList.RefundStatus == 'REFUND_CLOSE')
                && itemSellerSkuList.Status == "waitbuyerreceive" ?
                <span class="product-status warnBackColor">已发货</span>
                : null
              }
              {itemSellerSkuList.IsTerminateProxy == true ?
                <span class="product-status warnBackColor">已终止</span>
                : null
              }
            </div>
            <ul>
              <li title="商品标题">{itemSellerSkuList.ProductSubject}</li>
              <li>
                <span>商家规格:</span>
                <span class="spgg mainColor">{itemSellerSkuList.Color}{itemSellerSkuList.Size}</span>
              </li>
              {
                itemSellerSkuList.IsFenXiao == true && itemSellerSkuList.IsMapping == false ?
                  <li>
                    <span class="order-seller-skuStats-orange">规格未匹配</span>
                    {/* <span class="defColor hover" onClick={()=>{ this.matchSkuClick(itemSellerSkuList,item) }}> 去匹配</span> */}
                    <span class="defColor hover" onClick={() => { this.showSkuMapping(itemSellerSkuList) }}> 去匹配</span>
                  </li>
                  : null
              }
              {
                itemSellerSkuList.IsFenXiao == true && itemSellerSkuList.IsSendFaild == true ?
                  <li>
                    <span class="order-seller-skuStats-red" >自动发货失败，请手动重新发货 </span>
                    <span onClick={() => this.onlineSendErrorMsg(item.SellerOrder.PlatformOrderId, itemSellerSkuList.OrderItemCode)} className="dangerColor hover">查看原因</span>
                  </li>
                  : null
              }
              {
                itemSellerSkuList.IsFenXiao == true && this.state.orderStatusIndex == 0 && itemSellerSkuList.IsMapping == true ?
                  <li style={{ display: 'flex', gap: '8px' }}>

                    <span class="defColor hover" onClick={() => this.showSkuMapping(itemSellerSkuList, true)}>更换货源规格</span>
                    {/* <span class="defColor hover" onClick={() => this.relevanceProduct(itemSellerSkuList, 1,item)}>替换货源</span> */}

                  </li>
                  : null
              }
            </ul>
            <div class="productNum mainColor">
              <span>￥{itemSellerSkuList.ItemAmount}</span>
              <span>x{itemSellerSkuList.Count}</span>
            </div>
          </div>
        </td>
        {
          index == 0 ?
            <td rowspan={sellerOrderLength > 1 ? 2 : sellerOrderLength} style={{ textAlign: "center" }} className="hebin">
              <div style={{ marginBottom: "8px" }}>
                <span class="mainColor">{item.SellerOrder.ProductCount}种商品共计{item.SellerOrder.ProductItemCount}件</span>
              </div>
              <div style={{ marginBottom: "8px" }}>
                <span>金额:(含运费:￥{item.SellerOrder.ShippingFee}) ￥{item.SellerOrder.TotalAmount}</span>
              </div>
              {
                this.state.orderStatusIndex == 0 ?
                  <div>
                    {
                      this.state.purchaseOrderStatusIndex == 0 || this.state.purchaseOrderStatusIndex == 1 ?
                      <span class="defColor hover" onClick={() => this.ignoreOrder(1, item.SellerOrder.OrderCode)}>忽略订单 </span>:null
                    }
                   
                    {
                      this.state.purchaseOrderStatusIndex == 0 || this.state.purchaseOrderStatusIndex == 1 ?
                        <span class="defColor hover" onClick={() => this.confirmOrder(item.SellerOrder.OrderCode, item)}>确认采购单</span> : null
                    }
                  </div> : null
              }
              {
                this.state.orderStatusIndex == 5 ?
                  <div>
                    {
                      <span class="defColor hover" onClick={() => this.ignoreOrder(0, item.SellerOrder.OrderCode)}>取消忽略</span>
                    }
                  </div> : null
              }
            </td> : null
        }
      </tr>
    )
  }
  //#endregion


  //#region  采购单显示
  relevanceProductRender = (orderItems) => {
    return (

      <table class="orderTables table-style02">
        <tr>
          <td class="orderTables-headerTd">
            <div class="orderTables-header" style={{ backgroundColor: "#f6f9fd" }}>
              <div class="orderTables-header-left">采购订单：确认后生成</div>
            </div>
          </td>
        </tr>
        {
          orderItems.filter(item => item.IsFenXiao != true).map((item, index) =>
            <tr style={{ height: '80px' }} className={index > 1 ? "hideTr tr" + index : "tr" + index}>
              <td>
                <div className='relevanceProductWrap'>
                  <span class="norDefBtn" type="primary" onClick={() => this.relevanceProduct(item)}>
                    <i className='iconfont icon-jia-copy1'></i>
                    <span>关联货源</span>
                  </span>
                  <div className='relevanceProductWrap-right'>
                    <span>1.暂无相关信息,请先<i className='dangerColor'>关联货源并匹配规格</i></span>
                    <span>2.<i className='dangerColor'>仅需添加一次</i>，完成后该sku的全部订单自动匹配货源sku</span>
                  </div>
                </div>
              </td>
            </tr>
          )
        }
        {
          orderItems.length > 2 ?
            <tr><td colspan="2"><div><span className="moreShowBtn" onClick={(e) => this.moreShowProduct(e, orderItems.length)}><i className="iconfont icon-down"></i><s>展开更多</s></span></div></td></tr> : null
        }
        {/* <tr>
          <td ></td>
        </tr> */}
      </table>
    )
  }

  // 采购订单信息页面
  renderBuyerOrderTr = (itemBuyList, itemBuySkuList, index, itemBuySkuListLength, item) => {
    return (
      <tr style={{ padding: "1px 5px" }} className={index > 1 ? "hideTr tr" + index : "tr" + index}>
        <td style={{ width: "360px" }}>
          <div class="productShow">
            <div class="productShow-imgWrap">
              <img src={itemBuySkuList.ProductImgUrl}
                alt="" />
              {
                itemBuySkuList.RefundStatus != "" && itemBuySkuList.RefundStatus != null && itemBuySkuList.RefundStatus != "REFUND_SUCCESS" ?
                  <span className="product-status" style={{ backgroundColor: "#fe6f4f" }}>退款中</span> : null
              }
              {
                itemBuySkuList.RefundStatus != "" && itemBuySkuList.RefundStatus != null && itemBuySkuList.RefundStatus == "REFUND_SUCCESS" ?
                  <span className="product-status" style={{ backgroundColor: "#fe6f4f" }}>退款完成</span> : null
              }
              {
                (itemBuySkuList.RefundStatus == "" || itemBuySkuList.RefundStatus == null) && itemBuySkuList.Status == "waitbuyerreceive" ?
                  <span className="product-status" style={{ backgroundColor: "#5584ff" }}>已发货</span> : null
              }
              {
                ((this.state.orderStatusIndex == 0 && this.state.purchaseOrderStatusIndex == 3) || this.state.orderStatusIndex != 0) && itemBuySkuList.Status&&(itemBuySkuList.Status=="waitbuyerreceive"||itemBuySkuList.Status == 'waitsellersend')?
                <span className="product-status" style={{ backgroundColor: "#5584ff" }}>{itemBuySkuList.Status == 'waitsellersend' ? '待发货': '已发货'}</span>: null
              }
            </div>
            <ul>
              <li title="商品标题" data-logger-action-type="dgj_action_order_item" className={itemBuyList.BuyerOrder.BuyOrderType != 1 && fromClassName({
                hover:true,
                defColor: itemBuySkuList.SourcePlatform != 'TaoteZhuKe' && (itemBuySkuList.IsMapping || itemBuyList.BuyerOrder.PlatformOrderId)
              })} onClick={()=>{ itemBuyList.BuyerOrder.BuyOrderType != 1 && this.tohuoyuanLink(itemBuySkuList,itemBuyList) }}>{itemBuySkuList.ProductSubject}</li>
              <li>
                <span>商家规格:</span>
                <span class="spgg mainColor">{itemBuySkuList.Color} {itemBuySkuList.Size}</span>
                {
                  !itemBuySkuList.SubItemID && itemBuySkuList.SkuID ?
                    <span style={{ marginLeft: '4px' }}><i className='iconfont icon-piliangbianji hover defColor' onClick={() => { this.showEditSkuMapping(itemBuySkuList, item.SellerOrder) }}></i></span>
                    : null
                }
                {
                  itemBuySkuList.IsProductRelation ?
                    <span className='tarTxt tarTxt07'>临时</span> : null
                }
              </li>
              {itemBuySkuList.PickupAssr ? <li><span style={{backgroundColor: '#ec808d',alignItems: 'center',fontSize: '12px',height: '21px', borderRadius: '4px'}} className='productShow-content-sku-tag'>{itemBuySkuList.PickupAssr}h晚揽必赔</span></li>:null}
            </ul>
            <div class="productNum mainColor">
              <span>￥{itemBuySkuList.ItemAmount}</span>
              <span>x{itemBuySkuList.Count}</span>
            </div>
          </div>
        </td>

        {index == 0 ?
        <td rowspan={itemBuySkuListLength > 1 ? 2 : itemBuySkuListLength} style={{ textAlign: "center" }} className="hebin">
          {
            itemBuyList.BuyerOrder.BuyOrderType != 1 && itemBuyList.BuyerOrder != null ?
              <div style={{ marginBottom: "8px", display: "flex", flexDirection: "column" }}>
                <span class="mainColor" style={{ marginBottom: "8px" }}>{itemBuyList.BuyerOrder.ProductCount}种商品共计{itemBuyList.BuyerOrder.ProductItemCount}件</span>
                {itemBuyList.BuyerOrder.TotalAmount != null ? <span>金额:(含运费:￥{itemBuyList.BuyerOrder.ShippingFee}) ￥{itemBuyList.BuyerOrder.TotalAmount}</span> : null}
              </div>
              : null
          }
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>

            {
              itemBuyList.BuyerOrder.BuyOrderType != 1 && itemBuyList.BuyerOrder != null && itemBuyList.BuyerOrder.PlatformStatus != null && itemBuyList.BuyerOrder.PlatformStatus != "" ?
                <div style={{ marginRight: "5px" }} onClick={() => this.orderDetailLink(itemBuyList.BuyerOrder)}>
                  <span className="defColor hover">订单详情</span>
                </div> : null
            }

            {
              itemBuyList.BuyerOrder != null && itemBuyList.IsSendFaild == true ?
                <div style={{ marginRight: "5px" }} onClick={() => this.reOnlineSend(item.SellerOrder.OrderCode, item.SellerOrder.PlatformOrderId, itemBuyList.BuyerOrder.OrderCode, itemBuyList.BuyerOrder.PlatformOrderId)}>
                  <span className="dangerColor hover">重新发货</span>
                </div> : null
            }
            {
              itemBuyList.BuyerOrder != null && itemBuyList.BuyerOrder.PlatformStatus != null && itemBuyList.BuyerOrder.PlatformStatus == "waitbuyerpay" ?
                <div data-logger-action-type="dgj_action_supplier_order_cancel" style={{ marginRight: "5px" }} onClick={() => this.orderDetailLink(itemBuyList.BuyerOrder, true, itemBuyList.BuyerOrder.PlatformOrderId, itemBuyList.BuyerOrder.OrderCode, item.SellerOrder.PlatformOrderId)}>
                  <span className="dangerColor hover">取消订单</span>
                </div> : null
            }

            {/* {
                itemBuyList.BuyerOrder != null && itemBuyList.BuyerOrder.PlatformStatus == "cancel" ?
                  <div style={{ marginRight: "5px" }} onClick={() => this.anewCreateOrder(item.SellerOrder.OrderCode, itemBuyList.BuyerOrder.OrderCode)}>
                    <span className="dangerColor hover">重新采购</span>
                  </div> : null
              } */}

            {
              itemBuyList.BuyerOrder != null && itemBuyList.BuyerOrder.PlatformStatus != null && itemBuyList.BuyerOrder.PlatformStatus == "waitbuyerpay" ?
                <div >
                  <span data-logger-action-type="dgj_action_supplier_order_pay" className="defColor hover" onClick={() => this.orderPayment(item.SellerOrder.OrderCode)}>向供应商付款</span>
                </div> : null
            }
            {
              (itemBuySkuList.Status != "waitbuyerreceive" && this.state.orderStatusIndex == 0 && this.state.purchaseOrderStatusIndex == 3 && itemBuyList.BuyerOrder.BuyOrderType == 1)?
              <div data-logger-action-type="dgj_action_supplier_order_cancel" style={{ marginRight: "5px" }} onClick={() => this.cancelPrivateDomain(itemBuyList.BuyerOrder.OrderCode)}>
                <span className="defColor hover">取消私域推单</span>
              </div>:null
            }
            {
              ((this.state.orderStatusIndex == 1 || this.state.orderStatusIndex == 2) && itemBuyList.BuyerOrder.BuyOrderType == 1 && itemBuyList.BuyerOrder.PlatformStatus == "waitbuyerreceive")?
              <div data-logger-action-type="dgj_action_supplier_order_cancel" style={{ marginRight: "5px" }} onClick={() => this.confirmReceipt(2,itemBuyList.BuyerOrder.OrderCode)}>
                <span className="defColor hover">确认收货</span>
              </div>:null
            }
          </div>
        </td>: null
        }


      </tr>

    )
  }

  renderOrderErrorMessageDialog=(errorMessage)=>
    {  
        return   <div>
        <div className='popoverCommon' style={{'display':'inline-block',marginLeft:'10px'}}>
            <span className='dangerColor hover' style={{'whiteSpace':'nowrap','overflow':'hidden','textOverflow':'ellipsis','width':'200px','display':'inline-block'}}>下单失败：{errorMessage}</span>
            <div className='popoverCommon-warn' style={{width:'max-content',maxWidth:'560px',lineHeight:'25px',color:'#333'}}>
                {errorMessage}
            </div>
        </div>
        <a className='defColor hover' target='_blank' href='https://tzdcbolvez.feishu.cn/wiki/QctVwFnsYiIIAVkyCm3csQ6On4c?from=from_copylink'>查看帮助&gt;&gt;</a>
      </div>;
    }

  moreBuyerListReader(item, itemBuyList, buyerOrderIndex) {
    let buyerItemsLength = itemBuyList.BuyerOrder ? itemBuyList.BuyerOrder.OrderItems.length : 0;
    let sellerOrderLength = item.SellerOrder.OrderItems.filter(item => item.IsFenXiao != true).length;
    let len = buyerOrderIndex == item.BuyerOrders.length - 1 ?
      buyerItemsLength + sellerOrderLength
      : buyerItemsLength;
    return len > 2 ?
      (<tr><td colspan="2"><div><span className="moreShowBtn" onClick={(e) => this.moreShowProduct(e, itemBuyList.BuyerOrder.OrderItems.length)}><i className="iconfont icon-down"></i><s>展开更多</s></span></div></td></tr>) : null
  }
  relevanceProduct = (item) => {
    var shopId = this.state.newSelectShopId;
    var selectShopPlatformType = this.state.selectShopPlatformType;
    this.setState({
      isChangeProductsModule: true,
      selectProductId: item.ProductID,
      selectedShopProductImgSrc: item.ProductImgUrl,
      selectProductSkuId: item.SkuID,
      selectShopId: item.ShopId,
      selectShopPlatformType: selectShopPlatformType,
      skuMappingsModuleRelationData: null,
      isReturnSelectSupplierProduct: 0,
      tempOrderItemCode:item.OrderItemCode,
      tempOrderCode:item.OrderCode,
    })
  }

  //#endregion


  //#region  切换，选择店铺，切换状态
  //切换标签
  changeNav(item) {
    this.state.orderStatus.forEach(x => x.active = false);
    item.active = true;
    var orderStatusIndex = item.id;

    if (item.title == "交易关闭") {
      $("#searchWarn").css({ display: "flex" })
    } else {
      $("#searchWarn").css({ display: "none" })
    }
    if (item.title == "待发货") {
      $("#SourcePlatformNav").css({ display: "flex" });
      $("#waitingSendExportId").css({ display: "flex" });
      $("#decryptOprateId").css({ display: "flex" });
    } else {
      $("#SourcePlatformNav").css({ display: "none" });
      $("#waitingSendExportId").css({ display: "none" });
      $("#decryptOprateId").css({ display: "none" });
    }
    this.substateCheckboxEmpty();//清空子状态勾选


    var purchaseOrderStatusIndex = this.state.purchaseOrderStatusIndex;
    var purchaseOrderStatusList = this.state.purchaseOrderStatusList;
    var sourcePlatformList = this.state.sourcePlatformList;
    var isShowWaiSendTopCount = this.state.isShowWaiSendTopCount;
    if (item.id != 0)//不是在待发货的状态下，采购单选择重置
    {
      purchaseOrderStatusList.forEach(x => x.active = false)
      purchaseOrderStatusList[0].active = true;//0是全部
      purchaseOrderStatusIndex = 0;

      sourcePlatformList.forEach(x => {
        x.active = false;
        x.isHide = false;
      })
      sourcePlatformList[0].active = true;//0是全部
    } else {
      purchaseOrderStatusList.forEach(x => x.active = false)
      purchaseOrderStatusList[1].active = true;//1是待采购
      purchaseOrderStatusIndex = 1;

      sourcePlatformList.forEach(x => {
        x.active = false;
        x.isHide = false;
      })
      sourcePlatformList[1].active = true;//1是1688货源
      isShowWaiSendTopCount = false;
    }


    this.setState({
      isLoading: true,
      current: 1,
      orderStatusIndex: orderStatusIndex,
      refundType: "",
      orderSubstate: "",
      purchaseOrderStatusIndex: purchaseOrderStatusIndex,
      purchaseOrderStatusList: purchaseOrderStatusList,
      sourcePlatformList: sourcePlatformList,
      isShowWaiSendTopCount: isShowWaiSendTopCount,//待发货下，货源数量和待发货数量，重新统计
    }, () => {
      this.loadList();
    });
  }
  //切换货源平台
  changeSourcePlatform(item) {
    const current = this.state.sourcePlatformList.find(x => x.active);
    if (current.id == item.id) return;
    if (item.value == 'TaoteZhuKe' && localStorage.getItem('orderList_hasChangeTaoteSourcePlatform') != '1') {
      localStorage.setItem('orderList_hasChangeTaoteSourcePlatform', '1')
      this.setState({ 'taoteCanNotOperateDailog': true })
    }
    this.state.current = 1
    this.state.sourcePlatformList.forEach(x => x.active = false)
    item.active = true
    this.state.refundType = '';
    this.state.sourcePlatformIndex = item.id;
    this.setState({ isLoading: true }, () => { this.loadList() })
  }
  //切换采购单状态
  changePurchaseOrderStatus(item) {
    const current = this.state.purchaseOrderStatusList.find(x => x.active);
    if (current.id == item.id) return;

    this.state.current = 1
    this.state.purchaseOrderStatusList.forEach(x => x.active = false)
    item.active = true;
    this.state.refundType = '';

    this.setState({ isLoading: true, purchaseOrderStatusIndex: item.id }, () => {this.ziOrderStatus()})
  }


  //子状态按钮显示
  ziOrderStatus(){
    var selectShopPlatformType = this.state.selectShopPlatformType;
    var purchaseOrderStatusIndex=this.state.purchaseOrderStatusIndex;
    if (purchaseOrderStatusIndex ==3  &&selectShopPlatformType !="Pinduoduo" )
    $("#sendErrorByLeftId").css({ display: "flex" });
    else
    $("#sendErrorByLeftId").css({ display: "none" });


    if(purchaseOrderStatusIndex ==3  && selectShopPlatformType == "Pinduoduo")
      $("#exportByRightId").css({ display: "flex" });
    else
      $("#exportByRightId").css({ display: "none" });

      
    var sourcePlatformList=this.state.sourcePlatformList;
    sourcePlatformList.forEach(x => x.active = false)
    if(purchaseOrderStatusIndex ==2  || purchaseOrderStatusIndex ==3)
    {
      //如果选择的就是隐藏的未关联货源。由于需要影响，把设置改下
      // const sourcePlatformStatusIndex = sourcePlatformList.find(x => x.active).value;
      // if(sourcePlatformStatusIndex == "no_relation")
      // {
      //   sourcePlatformList[1].active=true;
      //   sourcePlatformList[3].active=false;
      // }
      sourcePlatformList[0].active = true;
      sourcePlatformList[0].isHide=true;
      sourcePlatformList[1].isHide=true;
      sourcePlatformList[2].isHide=true;
    }
    else 
    {
      sourcePlatformList[0].active = true;
      sourcePlatformList[0].isHide=false;
      sourcePlatformList[1].isHide=false;
      sourcePlatformList[2].isHide=false;
    }
       

    console.log("sourcePlatformList:"+JSON.stringify(sourcePlatformList))
    this.setState({sourcePlatformList:sourcePlatformList},()=>{this.loadList()});
  }

  //选择店铺
  selectShopFun = (Sid) => {
    let shopId="";
    if(Sid){
      shopId=Sid
    }else{
      shopId = this.state.newSelectShopId;
    }

    this.substateCheckboxEmpty();//清空子状态勾选
    $("#orderListInputOrderId").val("");//清空订单编号输入内容
    $("#supplierWangWangInputId").val("");//清空订单编号输入内容
    $("#orderProductByTypeInputeId").val("");//清空订单编号输入内容
    this.orderInputOnClick();

    if (shopId == undefined || shopId == "") {
      app.MessageShow("warning", '请选择店铺！', 1500);

      this.clearData();//清除所有弹出数据
      this.setState({
        orderList: [],
        isNotList: true,
        isShowSyncOrderShopCdt:false,
        syncOrderShopCdtSeconds:0,
        sysncOrderStatusTaskProgress:100,
        lastSyncTimeByShop: '',
        orderStatus: [
          { id: 0, value: "", title: "待发货", active: true, num: 0 },
          { id: 1, value: "", title: "已发货", active: false, num: 0 },
          { id: 2, value: "", title: "交易完成", active: false, num: 0 },
          { id: 3, value: "", title: "交易关闭", active: false, num: 0 },
          { id: 4, value: "", title: "退款中", active: false, num: 0 },
        ],
        isShowWaiSendTopCount: false,
      })

      return false;
    }
    this.setState({ isLoading: true,
      current: 1,
     orderSubstate: "" ,
     isShowSyncOrderShopCdt:false,
     syncOrderShopCdtSeconds:0,
     sysncOrderStatusTaskProgress:100});

    this.loadList(shopId);//获取店铺列表
    this.syncOrderByStatus(); //获取店铺（订单）同步情况。
    this.loadWaitSendByTopNumberShow();
    this.ziOrderStatus();//子状态隐藏和显示
  }
  //清除数据
  clearData() {
    //清除数据
    this.setState({
      selectOrderList: [],
      selectPurchaseOrderList: [],
      isShowModalBynotCategory: false,
      isShowModalBynotCategoryDouble:false,
      isShowModalByBatchOpen: false,
      isShowModalByCreateOrderError: false,
      createOrderError: [],
      isShowModalByNotOpen: false,
      isShowModalByVerifyOpen: false,
      isShowModalBySelectPayment: false,
      isShowAutoPayButton: false,
      isShowModalBySelectPaymentError: false,
      getPaymentErrorFaildOrderList: [],
      getPaymentErrorNotWaitPayIds: [],
      getPaymentErrorPayChannelsList: [],
      isShowModalByPayUrlError: false,
      getPayUrlErrorFaildOrderList: [],
      getPayUrlErrorPayChannelsList: [],
      isShowModalByAutoPaymentError: false,
      isShowModalByOpenUpAndNotOpen: false,
    })
  }
  //清空子状态勾选
  substateCheckboxEmpty = () => {
    var checkList = $("input[name='checkboxNameByOrderStatus']");
    for (let i = 0; i < checkList.length; i++) {
      var ck = $(checkList[i]);
      ck.prop({ checked: false });
    }
  }



  //查询一次待发货下的总数量，以及不同货源下的数量显示
  loadWaitSendByTopNumberShow = () => {

    var that = this;
    var obj = {
      Days: $("#selectChooseDateId").val(),
      ShopId: this.state.newSelectShopId,
      PlatformType: this.state.selectShopPlatformType
    }

    app.requests({
      url: "/Common/GetWaitSendByTopNumberShow",
      data: obj,
      success: function (res) {
        that.setState({ isShowWaiSendTopCount: true });
        if (res.RequestError == true)//请求失效了。isLoading关闭看需求写
          return;

        if (res.Success) {
          var waiSendCount = res.Data.WaiSendCount;
          var waiSendAliProductCount = res.Data.WaiSendAliProductCount;
          var waitSendNotAliProductCount = res.Data.WaitSendNotAliProductCount;
          var waitSendNotProductCount = res.Data.WaitSendNotProductCount;

          var sourcePlatformList = that.state.sourcePlatformList;
          for (let index = 0; index < sourcePlatformList.length; index++) {
            if (sourcePlatformList[index].value == "AlibabaZhuKe")
              sourcePlatformList[index].number = waiSendAliProductCount;
            else if (sourcePlatformList[index].value == "TaoteZhuKe")
              sourcePlatformList[index].number = waitSendNotAliProductCount;
            else if (sourcePlatformList[index].value == "no_relation")
              sourcePlatformList[index].number = waitSendNotProductCount;
          }

          console.log("orderStatusList:"+JSON.stringify(orderStatusList));
          var orderStatusList = that.state.orderStatus;
          for (var i = 0; i < orderStatusList.length; i++) {
            if (orderStatusList[i].active == true && orderStatusList[i].title == "待发货") {
              orderStatusList[i].num = waiSendCount;
              console.log("waiSendCount:"+JSON.stringify(waiSendCount));
              break;
            }
          }
          console.log("sourcePlatformList:"+JSON.stringify(sourcePlatformList));
          console.log("orderStatusList:"+JSON.stringify(orderStatusList));
          that.setState({ sourcePlatformList: sourcePlatformList, orderStatusList: orderStatusList });

        }
      },
    });

  }


  //#endregion


  //#region  公共
  toProcurementOrder() {
    var obj = {};
    obj.shopId = this.state.newSelectShopId;
    var path = {
      pathname: '/procurementOrder',
      state: obj
    }
    hashHistory.push(path);
  }

  gotoShopList = () => {
    $("#myShopListIndexId").click();
  }


  //关闭模板弹窗
  closeModal = (modalName) => {

    //如果来源是订单的报错需要刷新一下订单数据
    if(modalName=="isShowCommonError")
    {
        this.loadList();
    }
    this.setState({
      [modalName]: false
    })
   
  }
  //改变 一页多少条
  changePageSize(pagesize) {
    //this.orderListCheckboxClose();//清除勾选按钮  //放在查询里
    this.setState({ pagesize: pagesize, current: 1, isLoading: true }, () => {
      this.loadList();
    })
  }
  //改变页码
  changePageCurrent(current) {
    this.setState({ current: current, isLoading: true }, () => {
      this.loadList();
    })
  }



  agreeTaoteCanNotOperate() {
    localStorage.setItem('orderList_footer_taote_click', JSON.stringify({ timestamp: Date.now() }))
    this.state.showTaoteFooter = false;
    this.setState({})
  }

  //#endregion

  //#region  订单同步和时间显示
  //更新同步订单
  async syncOrder(dayid) {
    var shopByLists = [];
    shopByLists.push(this.state.newSelectShopId);
    const day = $("#" + dayid).val();
    var data = {
      SyncSids: shopByLists,
      Source: 0,
      SyncOrderType: 1,
      TimeParagraph: day
    }
    this.setState({ sysncOrderStatusTaskProgress: 0 });
    this.setState({ isLoading: true });
    const res = await triggerSync(data);
    this.setState({ isSyncOrderModal: false });
    this.setState({ isLoading: false });
    if (res.RequestError == true)//请求失效了。isLoading关闭看需求写
    {
      this.setState({ sysncOrderStatusTaskProgress: 0 });
      return;
    }

    if (res.Success) {
      app.MessageShow('success', "已提交后台执行，请在同步完成后再刷新页面查看数据！");
      this.syncOrderByStatus();
    } else {
      app.MessageShow('error', "同步错误：" + res.Message);
      this.setState({ sysncOrderStatusTaskProgress: 0 });
    }
  }
  async syncOrderByStatus() {
    
    var shopid = this.state.newSelectShopId;
    var platformType = this.state.selectShopPlatformType;

    var sid_pt = [];
    sid_pt.push({ Key: shopid, Value: platformType });
    const res = await getSyncStatus({ Sid_PlatformType: sid_pt });
    if (res.RequestError == true)//请求失效了。isLoading关闭看需求写
    {
      this.setState({ isSyncLoading: false });
      this.setState({ sysncOrderStatusTaskProgress: 100 });
      return;
    }

    if (res.Success) {
      if (res.Data.Percent == 100) {
        const lastSyncTime = res.Data.LastSyncTime;
        if (lastSyncTime != null && lastSyncTime != "" && lastSyncTime != undefined) {
          const dueTime = new Date(lastSyncTime);
          dueTime.setMinutes(dueTime.getMinutes() + 10);
          const currentTime = new Date();
          if (currentTime < dueTime) {            
            this.calShopCountDownCount(dueTime.getTime());
            this.setState({ isShowSyncOrderShopCdt: true, syncOrderShopCdtTime: dueTime.getTime() });
          }
        }
        this.setState({ sysncOrderStatusTaskProgress: res.Data.Percent });
        this.shopLastSyncTime(shopid, platformType);


        //开始检测
        this.orderToNotProductSync(shopid);
      } else {
        this.setState({ sysncOrderStatusTaskProgress: res.Data.Percent });
        setTimeout(() => {
          this.syncOrderByStatus();
        }, 1000);
      }
    }else {
      this.setState({ sysncOrderStatusTaskProgress: 100 });
    }
  }
   
  //按订单检测一次
  orderToNotProductSync(shopId) {
    app.requests({
      url: "/Product/OrderToNotProductSync",
      data: { ShopId: shopId },
      success: (res) => {
      }
  });
  }


  //获取最后同步的时间
  async shopLastSyncTime(shopId, platformType) {
    const obj = {
      ShopIds: [shopId],
      SyncType: 1,
      PlatformType: platformType
    }
    const res = await getLastSyncTime(obj);
    if (res.RequestError == true)//请求失效了。isLoading关闭看需求写
      return;
    if (res.Success) {
      var lastSyncTime = res.Data;
      this.setState({ lastSyncTimeByShop: lastSyncTime });
    } else {
      app.MessageShow('error', "获取最后同步时间，错误信息：" + res.Message);
    }
  }
  //#endregion


  //#region  展示更多
  moreShowProduct(e, len) {
    let eleName = e.target.nodeName.toUpperCase();
    let ele = null;
    if (eleName == "SPAN") {
      ele = $(e.target);
    } else {
      ele = $(e.target).closest("span");
    }
    if (ele.hasClass("moreTrShow")) {
      ele.removeClass("moreTrShow").closest("tr").prevAll(".hideTr").css({ display: "none" });
      ele.find("s").text("展开更多");
      ele.closest("tr").prevAll(".tr0").find(".hebin").attr("rowspan", 2);
    } else {
      ele.addClass("moreTrShow").closest("tr").prevAll(".hideTr").css({ display: "table-row" });
      ele.find("s").text("收起商品");
      ele.closest("tr").prevAll(".tr0").find(".hebin").attr("rowspan", len);
    }
  }
  //#endregion


  //#region 单选，多选按钮 （折叠）
  //单选事件
  orderChange = (e, sellerOrderCode) => {
    var isChecked = $("#" + sellerOrderCode + "_Id").prop("checked");

    var list = this.state.orderList;
    var selectOrderList = this.state.selectOrderList;

    //当前选中订单
    const selectOrder = list.find(o => o.SellerOrder.OrderCode == sellerOrderCode);
    if (selectOrder && selectOrder.SellerOrder.IsRisk == true) {
      app.MessageShow('warning', "选择的订单中包含平台风控订单，默认不选中；（平台标记去除前不支持处理此类订单）！");

      setTimeout(() => {
        $("#" + sellerOrderCode + "_Id").prop("checked", false);
      }, 500);
      return;
    }
    if (selectOrder && selectOrder.SellerOrder.IsOrderLogisticsTransitTag == true && this.state.orderStatusIndex==0 &&(this.state.purchaseOrderStatusIndex==0 || this.state.purchaseOrderStatusIndex ==1)) 
    {
      app.MessageShow('warning', "选择的订单中包含了中转订单，默认不选中，请确认后点击【确认采购单】单独进行下单！");
      setTimeout(() => {
        $("#" + sellerOrderCode + "_Id").prop("checked", false);
      }, 500);
      return;
    }

    if (selectOrder && selectOrder.SellerOrder.IsOrderKsLogisticsTransitTag == true && this.state.orderStatusIndex==0 &&(this.state.purchaseOrderStatusIndex==0 || this.state.purchaseOrderStatusIndex ==1)) 
    {
      app.MessageShow('warning', "选择的订单中包含了中转订单，默认不选中，请确认后点击【确认采购单】单独进行下单！");
      setTimeout(() => {
        $("#" + sellerOrderCode + "_Id").prop("checked", false);
      }, 500);
      return;
    }
    if (selectOrder && selectOrder.SellerOrder.IsOrderKsShunfengTag == true && this.state.orderStatusIndex==0 &&(this.state.purchaseOrderStatusIndex==0 || this.state.purchaseOrderStatusIndex ==1)) 
    {
        app.MessageShow('warning', "选择的订单中包含了顺丰包邮订单，默认不选中，请确认后点击【确认采购单】单独进行下单！");
        setTimeout(() => {
          $("#" + sellerOrderCode + "_Id").prop("checked", false);
        }, 500);
        return;
    }
    if (selectOrder && selectOrder.SellerOrder.IsPddHomeDeliveryDoorTag == true && this.state.orderStatusIndex==0 &&(this.state.purchaseOrderStatusIndex==0 || this.state.purchaseOrderStatusIndex ==1)) 
    {
      app.MessageShow('warning', "选择的订单中包含了送货上门订单，默认不选中，请确认后点击【确认采购单】单独进行下单！");
      setTimeout(() => {
        $("#" + sellerOrderCode + "_Id").prop("checked", false);
      }, 500);
      return;
    }
    if (selectOrder && selectOrder.SellerOrder.IsXiaoHongShuHomeDeliveryTag == true && this.state.orderStatusIndex==0 &&(this.state.purchaseOrderStatusIndex==0 || this.state.purchaseOrderStatusIndex ==1)) 
    {
      app.MessageShow('warning', "选择的订单中包含了送货上门订单，默认不选中，请确认后点击【确认采购单】单独进行下单！");
      setTimeout(() => {
        $("#" + sellerOrderCode + "_Id").prop("checked", false);
      }, 500);
      return;
    }
    if (selectOrder && selectOrder.SellerOrder.IsTouTiaoChooseDeliveryTag == true && this.state.orderStatusIndex==0 && (this.state.purchaseOrderStatusIndex ==0 || this.state.purchaseOrderStatusIndex ==1)) 
    {
      app.MessageShow("选择的订单中包含自选快递服务订单，默认不选中，请确认后点击【确认采购单】单独进行下单！", "warning");
          setTimeout(() => {
            $("#" + sellerOrderCode + "_Id").prop("checked", false);
          }, 500);
          return;
    }
    if (selectOrder && selectOrder.SellerOrder.IsPddLocalDepotTag == true && this.state.orderStatusIndex==0 && (this.state.purchaseOrderStatusIndex ==0 || this.state.purchaseOrderStatusIndex ==1)) 
    {
        app.MessageShow("选择的订单中包含拼多多本地仓订单，默认不选中，此类订单不支持采购下单！", "warning");
            setTimeout(() => {
              $("#" + sellerOrderCode + "_Id").prop("checked", false);
            }, 500);
            return;
    }
    

    var isRefund = false;
    for (let i = 0; i < list.length; i++) {
      if (list[i].SellerOrder.OrderCode == sellerOrderCode) {
        if (list[i].SellerOrder.RefundStatus != null && list[i].SellerOrder.RefundStatus != "" && list[i].SellerOrder.RefundStatus != "REFUND_CLOSE")
          isRefund = true;

        break;
      }
    }


    let isHas = false; //是否已经存在了
    for (let j = 0; j < selectOrderList.length; j++) {
      if (selectOrderList[j] == sellerOrderCode) {
        selectOrderList.splice(j, 1);
        isHas = true;  //点之前已经存在了
      }
    }
  

    //待发货状态下 正常未发货的商品不选中
    let normal = false;
    let privateDomain = false; // 交易完成状态下，存在非私域不选中
    if (this.state.orderStatusIndex == 0 && this.state.purchaseOrderStatusIndex == 3) {
      let order = list.find(o => o.SellerOrder.OrderCode == sellerOrderCode);
      if (order) {
        //没有发货失败且没有退款
        if (order.SellerOrder.OrderItems.find(item => item.IsSendFaild == false) && isRefund == false) {
          normal = true;
        }
      }
      if (!isHas && isRefund == false && normal == false) {
        selectOrderList.push(sellerOrderCode);
      }
    }else if(this.state.orderStatusIndex == 2){ 
      let order = list.find(o => o.SellerOrder.OrderCode == sellerOrderCode);
      if (order) {
        //是否存在非私域订单
        if (order.BuyerOrders.find(item => item.BuyerOrder.BuyOrderType != 1 )) {
          privateDomain = true;
        }else{
          let arr = [];
          order.BuyerOrders.map(item => {
            if (item.BuyerOrder.PlatformStatus == 'waitbuyerreceive') {
              arr.push(item.Id);
            }
          })
          if (arr.length > 0) {
            selectOrderList.push(sellerOrderCode);
          } else{
            privateDomain = true;
          }
        }
      }
    } else if (!isHas && isRefund == false) {//codeId 之前没有存在的，添加进去  //&& isRefund==false 临时
      selectOrderList.push(sellerOrderCode);
    }

    if ((isChecked && isRefund) || privateDomain) {
      setTimeout(() => {
        $("#" + sellerOrderCode + "_Id").prop("checked", false);
      }, 500);
    } else if (this.state.orderStatusIndex == 0 && this.state.purchaseOrderStatusIndex == 3 && normal == true && isChecked) {
      setTimeout(() => {
        $("#" + sellerOrderCode + "_Id").prop("checked", false);
      }, 500);
    }

    //去掉单选时，全选默认去掉
    if (!isChecked) {
      $("#allCheck_id_Below").prop("checked", false);//上面的按钮点击，下面的全选跟着变化
      $("#allCheck_id_Above").prop("checked", false);//下面的按钮点击，上面的全选跟着变化
    } else {
      if (selectOrderList.length == list.length) {
        $("#allCheck_id_Below").prop("checked", true);//上面的按钮点击，下面的全选跟着变化
        $("#allCheck_id_Above").prop("checked", true);//下面的按钮点击，上面的全选跟着变化
      }

    }

    var buyerCodeList = this.getListPurchaseOrderCode(selectOrderList, false);
    if (isRefund && isChecked)
      app.MessageShow('warning', '选中的商品包含了退款,批量操作会过滤，请到订单【右边的按钮】!');
    else if (normal && this.state.orderStatusIndex == 0 && this.state.purchaseOrderStatusIndex == 3 && isChecked)
      app.MessageShow('warning', '当前订单对应的采购单还未发货，不支持手动发货!');
    else if (privateDomain && this.state.orderStatusIndex == 2 && isChecked)
      app.MessageShow('warning', '当前订单对应的采购单必须为私域单且为待签收状态!');
    else {
      if (buyerCodeList.length > 50)
        app.MessageShow('warning', '已选择超过50条，手动支付会限制。');
    }


    this.setState({ selectOrderList: selectOrderList, orderList: list, selectPurchaseOrderList: buyerCodeList });


  }


  //全部，选择商品事件
  allCheckbox(types) {
    var isCheck = false;

    if (types == "above")
      isCheck = $("#allCheck_id_Above").prop("checked");//上面的按钮
    else
      isCheck = $("#allCheck_id_Below").prop("checked");//下面的按钮


    var selectOrderList = this.state.selectOrderList;
    var list = this.state.orderList;
    var isRefundNumber = 0;
    var isRiskOrderCount = 0;
    var isOrderLogisticsTransitCount = 0;
    var isOrderShunfengCount = 0;
    var isPddHomeDeliveryDoorTagCount=0;
    var isTouTiaoChooseDeliveryTagCount=0;
    var isPddLocalDepotTagCount=0;
    var isXiaoHongShuHomeDeliveryTagCount=0;
    if (!isCheck)  //取消全选  选中的selectOrderList 置空
    {
      selectOrderList = [];
      for (let i = 0; i < list.length; i++) {
        $("#" + list[i].SellerOrder.OrderCode + "_Id").prop("checked", false);
      }
    } else {
      for (let i = 0; i < list.length; i++) {
        //退款的不选中
        if (list[i].SellerOrder.RefundStatus != "" && list[i].SellerOrder.RefundStatus != null && list[i].SellerOrder.RefundStatus != "REFUND_CLOSE")
          isRefundNumber++;
        else if (list[i].SellerOrder.IsRisk == true) {
          isRiskOrderCount++;
        }
        else if (list[i].SellerOrder.IsOrderLogisticsTransitTag == true && this.state.orderStatusIndex==0 &&(this.state.purchaseOrderStatusIndex==0 || this.state.purchaseOrderStatusIndex ==1)) //中转地址
        {
          $("#" + list[i].SellerOrder.OrderCode + "_Id").prop("checked", false);
          isOrderLogisticsTransitCount++;
        }
        else if (list[i].SellerOrder.IsOrderKsLogisticsTransitTag == true && this.state.orderStatusIndex==0 &&(this.state.purchaseOrderStatusIndex==0 || this.state.purchaseOrderStatusIndex ==1)) //中转地址
        {
          $("#" + list[i].SellerOrder.OrderCode + "_Id").prop("checked", false);
          isOrderLogisticsTransitCount++;
        }
        else if (list[i].SellerOrder.IsOrderKsShunfengTag == true && this.state.orderStatusIndex==0 &&(this.state.purchaseOrderStatusIndex==0 || this.state.purchaseOrderStatusIndex ==1)) //顺丰包邮
        {
          $("#" + list[i].SellerOrder.OrderCode + "_Id").prop("checked", false);
          isOrderShunfengCount++;
        }
        else if (list[i].SellerOrder.IsPddHomeDeliveryDoorTag == true && this.state.orderStatusIndex==0 &&(this.state.purchaseOrderStatusIndex==0 || this.state.purchaseOrderStatusIndex ==1)) //送货上门
        {
          $("#" + list[i].SellerOrder.OrderCode + "_Id").prop("checked", false);
          isPddHomeDeliveryDoorTagCount++;
        }
        else if (list[i].SellerOrder.IsXiaoHongShuHomeDeliveryTag == true && this.state.orderStatusIndex==0 &&(this.state.purchaseOrderStatusIndex==0 || this.state.purchaseOrderStatusIndex ==1)) //送货上门
        {
          $("#" + list[i].SellerOrder.OrderCode + "_Id").prop("checked", false);
          isXiaoHongShuHomeDeliveryTagCount++;
        }
        else if(list[i].SellerOrder.IsTouTiaoChooseDeliveryTag==true && this.state.orderStatusIndex==0 && (this.state.purchaseOrderStatusIndex ==0 || this.state.purchaseOrderStatusIndex ==1))//送货上门
        {
          $("#" + list[i].SellerOrder.OrderCode + "_Id").prop("checked", false);
          isTouTiaoChooseDeliveryTagCount++;
        }
        else if(list[i].SellerOrder.IsPddLocalDepotTag==true && this.state.orderStatusIndex==0 && (this.state.purchaseOrderStatusIndex ==0 || this.state.purchaseOrderStatusIndex ==1))//送货上门
        {
          $("#" + list[i].SellerOrder.OrderCode + "_Id").prop("checked", false);
          isPddLocalDepotTagCount++;
        }
        else {
          if (this.state.orderStatusIndex == 2 && list[i].SellerOrder.OrderItems.filter(item => item.IsSendFaild).length == 0)//待发货下只选择发货失败的
          {
            var len = list[i].SellerOrder.OrderItems.filter(item => item.IsSendFaild).length;
            if (len > 0) {
              selectOrderList.push(list[i].SellerOrder.OrderCode);
            } else {
              $("#" + list[i].SellerOrder.OrderCode + "_Id").prop("checked", false);
            }
          } else {
            selectOrderList.push(list[i].SellerOrder.OrderCode);
            $("#" + list[i].SellerOrder.OrderCode + "_Id").prop("checked", isCheck);
          }
        }
      }
      selectOrderList = [...new Set(selectOrderList)];//数组去重
    }

    var titles = "全选的订单中,有" + isRefundNumber + "个订单包含退款，不默认选中，请单选！";
    if (isRefundNumber > 0)
      app.MessageShow('warning', titles);
    else if (isRiskOrderCount > 0)
      app.MessageShow('warning', "选择的订单中包含平台风控订单，默认不选中；（平台标记去除前不支持处理此类订单）");
    else if (isOrderLogisticsTransitCount > 0)
      app.MessageShow('warning', "选择的订单中包含了中转订单，默认不选中，请确认后点击【确认采购单】单独进行下单");
    else if (isOrderShunfengCount > 0)
      app.MessageShow('warning', "选择的订单中包含了顺丰包邮订单，默认不选中，请确认后点击【确认采购单】单独进行下单");
    else if (isPddHomeDeliveryDoorTagCount > 0)
      app.MessageShow('warning', "选择的订单中包含了送货上门订单，默认不选中，请确认后点击【确认采购单】单独进行下单");
    else if (isTouTiaoChooseDeliveryTagCount > 0)
      app.MessageShow('warning', "选择的订单中包含自选快递服务订单，默认不选中，请确认后点击【确认采购单】单独进行下单");
    else if (isPddLocalDepotTagCount > 0)
      app.MessageShow('warning', "选择的订单中包含拼多多本地仓订单，默认不选中，此类订单不支持采购下单");
    else if (isXiaoHongShuHomeDeliveryTagCount > 0)
      app.MessageShow('warning', "选择的订单中包含了送货上门订单，默认不选中，请确认后点击【确认采购单】单独进行下单");


    var buyerIdList = this.getListPurchaseOrderCode(selectOrderList, false);

    this.setState({ selectOrderList: selectOrderList, orderList: list, isAllChange: isCheck, selectPurchaseOrderList: buyerIdList });

    $("#allCheck_id_Below").prop("checked", isCheck);//上面的按钮点击，下面的全选跟着变化
    $("#allCheck_id_Above").prop("checked", isCheck);//下面的按钮点击，上面的全选跟着变化
  }


  //获取采购单  订单Code数组List
  getListPurchaseOrderCode(selectOrderList, isFiltrPany) {
    var orderList = this.state.orderList;

    var idList = [];
    if (selectOrderList == null || selectOrderList == undefined)
      idList = this.state.selectOrderList;
    else
      idList = selectOrderList;

    var purchaseOrderIdList = [];
    for (let i = 0; i < orderList.length; i++) {

      for (let j = 0; j < idList.length; j++) {
        if (idList[j] == orderList[i].SellerOrder.OrderCode) {
          var buyerOrdersList = orderList[i].BuyerOrders;
          for (let k = 0; k < buyerOrdersList.length; k++) {
            if (buyerOrdersList[k].BuyerOrder != null) {
              if (isFiltrPany && buyerOrdersList[k].BuyerOrder.ExtField1 != "Success"
                && buyerOrdersList[k].BuyerOrder.ExtField1 != "Paying"
                && buyerOrdersList[k].BuyerOrder.PlatformStatus == "waitbuyerpay")
                purchaseOrderIdList.push(buyerOrdersList[k].BuyerOrder.OrderCode)
            }
          }
          break;
        }
      }
    }

    return purchaseOrderIdList;
  }

  //#endregion



  //#region 关联货源确认和关闭
  sureChangeProductsModule = () => {
    this.setState({ isChangeProductsModule: false })
    this.loadList()
  }

  closeChangeProductsModule = (e) => {
    this.setState({
      isChangeProductsModule: false
    })
  }
  //#endregion


  //#region 店铺过期检测

  //店铺是否授权过期。
  shopIsAuthEnd = () => {
    var isAuth = false;
    var shopid =this.state.newSelectShopId;
    if (shopid != "" && shopid != undefined && shopid != null) {
      var shopList = this.state.shopListByFull;
      for (let i = 0; i < shopList.length; i++) {
        if (shopid == shopList[i].Id) {
          var shop = shopList[i];
          if (shop.PlatformType != "KuaiShou" && (shop.AuthUrl != "" || shop.PayUrl != ""))
            isAuth = true;

          if (shop.PlatformType == "KuaiShou" && (shop.AuthUrlOrder != "" || shop.PayUrlOrder != ""))
            isAuth = true;
        }
      }
    }

    return isAuth;
  }

  //#endregion



  //#region 确认采购单（折叠） 

  //继续解密下单
  confirmOrderByContinue=()=>{
    this.setState({noEncryptErrorDialog:false});
    this.confirmOrder(null,null,1);
  }


  //确认采购订单--按钮
  confirmOrder = (orderCode, itemData,isIgnoreLimit) => {

    var sellerOrder = null;
    if (itemData != undefined && itemData != null)
      sellerOrder = itemData.SellerOrder;

    var orderList = this.state.orderList;
    var selectOrderList = [];
    var notGenerateRetureOrderItem = 1;
    if (orderCode == null || orderCode == undefined || orderCode == "") {
      selectOrderList = this.state.selectOrderList;
      notGenerateRetureOrderItem = 0;
    }
    else
      selectOrderList.push(orderCode);

    if(isIgnoreLimit == 1)
       this.setState({isIgnoreLimitExpressly:1});
    else
       this.setState({isIgnoreLimitExpressly:0});

    var isTrue = $("#no_encrypt_error_check").is(':checked');
    if(isTrue&&isIgnoreLimit == 1)
    {
      localStorage.setItem("isIgnoreLimitExpressly_"+this.state.newSelectShopId,"1");
      
    }
    else{
      var token = localStorage.getItem("isIgnoreLimitExpressly_"+this.state.newSelectShopId) || null;
      if (token != null && token != undefined&&token=="1") {
        this.setState({isIgnoreLimitExpressly:1});
      }
    }   

    if (selectOrderList.length == 0) {
      app.MessageShow("notice", "请选择订单!");
      return;
    }
    if (sellerOrder && sellerOrder.IsShipHold == true) {
      app.MessageShow('notice', "选择的订单包含平台暂停发货订单，默认不选中，平台标记去除前不支持处理此类订单", 3000);
      return;
    }
    if (sellerOrder && sellerOrder.IsSpliceGroupTag == true) {
      app.MessageShow('notice', "选择的订单中包含未成团的拼团订单，默认不选中，成团前不支持处理此类订单单", 3000);
      return;
    }
    if (sellerOrder && sellerOrder.IsPddLocalDepotTag == true) {
      this.setState({pddLocalDepotTagDailog:true});
      return;
    }

    var notCategoryList = [];
    var notCategoryListTitle = "";
    var notCategoryListTitleNumber = 0;
    var mapListByOrderList = [];
    for (let i = 0; i < orderList.length; i++) {
      for (let j = 0; j < selectOrderList.length; j++) {
        if (orderList[i].SellerOrder.OrderCode == selectOrderList[j]) {
          var orderItemList = orderList[i].SellerOrder.OrderItems;
          for (let k = 0; k < orderItemList.length; k++) {
            if (orderItemList[k].IsFenXiao == true && orderItemList[k].IsMapping == false)//临时注释，为了有数据做跳转，这个验证需要有
            //if (orderItemList[k].IsFenXiao == true)//临时注释，为了有数据做跳转，这个验证需要有
            {
              var listJson = {
                ShopId: orderItemList[k].ShopId,
                ProductID: orderItemList[k].ProductID,
                SkuID: orderItemList[k].SkuID,
                SupplierProductId: orderItemList[k].SupplierProductId,
                SupplierProductCode: orderItemList[k].SupplierProductCode,
              }
              notCategoryList.push({ orderCode: orderList[i].SellerOrder.OrderCode, ListJson: listJson });
              if (notCategoryListTitleNumber == 3)
                notCategoryListTitle += "...";
              if (notCategoryListTitleNumber < 3)
                notCategoryListTitle += orderItemList[k].ProductSubject + "；";

              notCategoryListTitleNumber++;
            }else if(orderItemList[k].IsFenXiao == true && orderItemList[k].IsMapping == true)
                mapListByOrderList.push(orderList[i].SellerOrder.OrderCode);
          }
        }
      }
    }
    const notRelateOrders = orderList.filter(s => selectOrderList.includes(s.SellerOrder.OrderCode)).filter(s => !s.BuyerOrders || s.BuyerOrders.length == 0);
    //批量勾选时，不显示这个，因为有可能包含已经映射的
    if (orderCode != null && orderCode != undefined && orderCode != "" && notRelateOrders.length > 0) {
      app.MessageShow('notice', "所选订单有商品未关联货源，请先关联货源并匹配规格后再下单!", 3000);
      return;
    }

   
    if (mapListByOrderList.length ==0 && notCategoryList.length > 0) {
      this.setState({ notCategoryList: notCategoryList, notCategoryListTitle: notCategoryListTitle, isShowModalBynotCategory: true });
      return;
    }else if(mapListByOrderList.length > 0 && notCategoryList.length > 0)
    {
      this.setState({ notCategoryList: notCategoryList, notCategoryListTitle: notCategoryListTitle, isShowModalBynotCategoryDouble: true,mapListByOrderList:mapListByOrderList });
      return;
    }

    

    this.setState({ selectOrderList: selectOrderList,notGenerateRetureOrderItem:notGenerateRetureOrderItem}, () => {
      this.createPurchaseOrder();
    });
  }

  // 批量私域推单
  batchPrivateDomain = () => {
    if (this.state.selectOrderList.length == 0) {
      app.MessageShow("notice", "请选择订单!");
      return;
    }
    this.setState({
      isModal: true
    });
  }

  //未匹配规格，新的弹窗（有部分映射了）--继续下单（已匹配规格）
  sectorMapByShowModalByOk =()=>{
    this.setState({isShowModalBynotCategoryDouble:false});
    var mapListByOrderList= this.state.mapListByOrderList;
    var selectOrderList=[];
    if(mapListByOrderList.length==0)
     {
      app.MessageShow('notice', "所选的订单都没有包含关联并映射，请重新勾选再下单！", 3000);
      return;
     }

     var orderList=this.state.orderList;
     for (let i = 0; i < orderList.length; i++) {
      var isE=false;
      for (let j = 0; j < mapListByOrderList.length; j++) 
      {
        if(orderList[i].SellerOrder.OrderCode == mapListByOrderList[j]) 
           isE=true;
      }
      $("#" + orderList[i].SellerOrder.OrderCode + "_Id").prop("checked", isE);

      if(isE)
        selectOrderList.push(orderList[i].SellerOrder.OrderCode);
     }

     if(selectOrderList.length==0)
     {
      app.MessageShow('notice', "过滤后没有需要下单的订单，请刷新重试！", 3000);
      return;
     }
     $("#allCheck_id_Below").prop("checked", false);//上面的按钮点击，下面的全选跟着变化
     $("#allCheck_id_Above").prop("checked", false);//下面的按钮点击，上面的全选跟着变化
     this.setState({
      selectOrderList:selectOrderList
     },()=>{
      this.createPurchaseOrder();
     })
     

  }


  //未匹配规格，弹框操作--确认按钮
  notCategoryByShowModalByOk = () => {
    this.setState({});//关闭提示操作的弹框
    this.setState({isShowModalBynotCategoryDouble:false});//关闭新的弹窗，共用一个方法
    

    var lists = this.state.notCategoryList;
    var listJsons = [];
    for (let i = 0; i < lists.length; i++) {
      var jsons = lists[i].ListJson;

      //去重
      var isE = false;
      for (let j = 0; j < listJsons.length; j++) {
        if (jsons.ProductID == listJsons[j].ProductID)
          isE = true;
      }
      if (isE == false)
        listJsons.push(lists[i].ListJson);
    }

    for (const item of lists) {
      const listItem = listJsons.find(x => x.ProductID == item.ListJson.ProductID);
      if (listItem) {
        listItem.SkuIds = listItem.SkuIds || []
        listItem.SkuIds.push(item.ListJson.SkuID);
      }
    }

    var notCategoryListQu = [];

    this.setState({
      isShowModalBynotCategory: false,
      notCategoryListQu: notCategoryListQu
    });


    //this.relevanceProductList(listJsons);
    const debounceOtherTemp = debounceOther(() => {
      this.setState({ isLoading: false })
    }, 800);//防抖函数，用于最后一次更新
    if (listJsons.length > 0) {
      this.state.multiProductSkuMappingModuleList = []
      this.setState({ isLoading: true })
      listJsons.forEach(async apiData => {
        const res = await productRequest.LoadProductSkuMappingV2(apiData);
        debounceOtherTemp()
        if (res.Success) {
          res.Data.filterSkuIds = apiData.SkuIds
          this.state.multiProductSkuMappingModuleList.push(res.Data)
        }
      })
      setTimeout(() => {
        this.showProductMapping();
      }, 500)
    }
  }




  //未设置规格，  显示规格列表
  relevanceProductList = (listJsons) => {

    var list = [];

    var shopId = this.state.newSelectShopId;

    var productIdList = listJsons;
    for (let i = 0; i < productIdList.length; i++) {
      var product = productIdList[i];
      list.push({
        ShopId: shopId,
        ProductId: product.ProductID,
        SupplierProductId: product.SupplierProductId,
        SupplierProductCode: product.SupplierProductCode
      })
    }

    var selectShopPlatformType = this.state.selectShopPlatformType;
    //变成查询，是会查询平台和供应商映射信息
    this.setState({ isLoading: true, loadingTitle: '显示规格列表' });
    var that = this;
    app.requests({
      url: "/Product/LoadProductListByMapping",
      data: { ProductMappingList: list, ShopPt: selectShopPlatformType },
      success: function (res) {
        that.setState({ isLoading: false });
        if (res.RequestError == true)//请求失效了。isLoading关闭看需求写
          return;

        if (res.Success) {
          var list = res.Data.DataList;
          if (list == null || list == undefined)
            list = [];



          //默认选择第一个。
          if (list.length > 0) {
            for (let i = 0; i < list.length; i++) {
              if (i == 0) {
                list[i].IsShow = true;
                var shopId = list[i].Product.ShopId;
                var platformId = list[i].Product.PlatformId;
                setTimeout(() => {
                  that.relevanceProducShowButt(shopId, platformId);
                }, 500);
              } else
                list[i].IsShow = false;
            }

            that.setState({ notSetProductList: list });
          }

        } else {
          app.MessageShow('error', "获取规格错误：" + res.Message);
          that.setState({ isLoading: false });
        }
      },
    });

  }


  //未设置规格，  显示规格详情信息
  relevanceProducShowButt = (shopId, productId) => {

    var data = {
      ShopId: shopId,
      ProductId: productId
    };

    //变成查询，是会查询平台和供应商映射信息
    // this.setState({ isLoading: true,loadingTitle:'获取规格详情...'});
    this.setState({ isShowProductMappingOnload: true, loadingTitle: '获取规格详情...' });
    var that = this;
    app.requests({
      url: "/Product/LoadProductSkuMapping",
      data: data,
      success: function (res) {
        that.setState({ isShowProductMappingOnload: false, isLoading: false });
        if (res.RequestError == true)//请求失效了。isLoading关闭看需求写
          return;

        if (res.Success) {
          var skuList = res.Data.AlibabaProductSku;
          var product = res.Data.ProductFx;

          var supplierProductSkuList = [];

          var selectOrderList = that.state.selectOrderList;
          var purcharseOrderList = that.state.orderList;
          var skuIds = [];
          for (let i = 0; i < selectOrderList.length; i++) {

            let order = purcharseOrderList.find(s => s.SellerOrder.OrderCode == selectOrderList[i]);
            if (order && order.SellerOrder.OrderItems && order.SellerOrder.OrderItems.length > 0) {
              skuIds.push(...order.SellerOrder.OrderItems.map(s => s.SkuID));
            }
          }

          if (skuList.length > 0) {
            for (let i = 0; i < skuList.length; i++) {
              supplierProductSkuList.push({
                label: skuList[i].Color + skuList[i].Size,
                value: skuList[i].SkuId
              });
            }
          }

          var notDisplaySkuList = [];
          for (let i = 0; i < product.Skus.length; i++) {
            if (product.Skus[i].SupplierSkuList != null && product.Skus[i].SupplierSkuList.length > 0) {
              notDisplaySkuList.push(product.Skus[i].SkuId);

              //如果发现后台返回值的mappingcount为0，改为1
              for (let n = 0; n < product.Skus[i].SupplierSkuList.length; n++) {
                if (product.Skus[i].SupplierSkuList[n].MappingCount == null || product.Skus[i].SupplierSkuList[n].MappingCount == 0) {
                  product.Skus[i].SupplierSkuList[n].MappingCount = 1;
                }
              }
            }
          }

          that.setState({
            //isShowRelevanceProduct:true,//显示关联商品页面
            selectProduct: product,
            notDisplaySkuList: notDisplaySkuList,
            supplierLoginId: res.Data.SupplierLoginId,
            supplierProductId: res.Data.SupplierProductId,
            //supplierProduct:supplierProduct,
            supplierProductSkuList: supplierProductSkuList
          });
        } else {
          app.MessageShow('error', "获取规格错误：" + res.Message);
          that.setState({ isLoading: false });
        }
      },
    });

  }





  //未设置规格列表，选择商品 
  selectNotSetProduct = (platformId) => {

    var notSetProductList = this.state.notSetProductList;
    var that = this;
    for (let i = 0; i < notSetProductList.length; i++) {
      if (notSetProductList[i].Product.PlatformId == platformId) {
        notSetProductList[i].IsShow = true;

        //清空右边sku数据，重新查询渲染
        that.setState({ selectProduct: null, supplierProductSkuList: [] });

        var shopId = notSetProductList[i].Product.ShopId;
        var platformId = notSetProductList[i].Product.PlatformId;
        setTimeout(() => {
          that.relevanceProducShowButt(shopId, platformId);
        }, 0);
      } else
        notSetProductList[i].IsShow = false;
    }

    this.setState({ notSetProductList: notSetProductList });
  }

  //未匹配规格，提示操作--关闭事件
  cancelNotCategoryByShowModal = () => {
    this.setState({ isShowModalBynotCategory: false, notCategoryList: [], notCategoryListTitle: '' });
  }

  showProductMapping = () => {
    $("#productMappingDailog").css({
      right: 0
    })
    this.setState({ multiProductSkuMappingModuleDailog: true })
  }
  closeProductMapping = () => {
    $("#productMappingDailog").css({
      right: "-1000px"
    })
    this.setState({ multiProductSkuMappingModuleList: [], multiProductSkuMappingModuleDailog: false })
  }
  multiProductSkuMappingSaveSure = async (data) => {
    const apiData = {}
    apiData.TargetShopId = data.TargetShopId;
    apiData.TargetShopPt = data.TargetShopPt;
    apiData.Relations = data.Relations;
    this.setState({ isLoading: true })
    const res = await batchDistributionRequest.RelateProductV2(apiData);
    this.setState({ isLoading: false })
    this.closeProductMapping();

    if (!res.Success) {
      app.MessageShow('error', res.Message);
      return;
    }
    app.MessageShow('success', "关联成功");
    this.loadList();
  }

  gotoSupplierMarke=()=>{
    var obj = {};
    obj.platformType = this.state.selectShopPlatformType;
    var path = {
      pathname: '/supplierMarke',
      state: obj
    }
    hashHistory.push(path);
  }


  //批量忽略订单--按钮
  ignoreOrder = (ignoreType, orderCode) => {

    var selectOrderList = [];
    if (orderCode == null || orderCode == undefined || orderCode == "")
      selectOrderList = this.state.selectOrderList;
    else
      selectOrderList.push(orderCode);

    if (selectOrderList.length == 0) {
      app.MessageShow("notice", "请选择订单!");
      return;
    }

    var data = {
      IgnoreOrderCodes: selectOrderList,
      IgnoreType: ignoreType,
      ShopId: this.state.newSelectShopId
    }
    this.setState({ isLoading: true, loadingTitle: '操作采购单中...', selectOrderList: selectOrderList });
    var that = this;
    app.requests({
      url: "/PurchaseOrder/BatchIgnoreOrder",
      data: data,
      success: function (res) {
        that.setState({ isLoading: false });
        if (res.RequestError == true)//请求失效了。isLoading关闭看需求写
        {
          return;
        }

        if (res.Success) {
          if (ignoreType == 1)
            app.MessageShow('success', "忽略采购单成功。", 2200);
          else
            app.MessageShow('success', "已取消忽略采购单。", 2200);

          that.succeedOrderCodeList();
        } else {
          app.MessageShow('error', "错误信息：" + res.Message);
        }
      },
    });
  }



  //处理完成后，需要列表移除的调用这个方法
  succeedOrderCodeList = (platformOrderIdOrCode) => {
    var selectList = [];
    if (platformOrderIdOrCode != null && platformOrderIdOrCode != "" && platformOrderIdOrCode != undefined)
      selectList.push(platformOrderIdOrCode);
    else
      selectList = this.state.selectOrderList;

    var orderList = this.state.orderList;
    var newOrderList = [];
    for (let i = 0; i < orderList.length; i++) {
      var isE = false;
      for (let j = 0; j < selectList.length; j++) {
        //订单code或者订单编号
        if (orderList[i].SellerOrder.OrderCode == selectList[j] || orderList[i].SellerOrder.PlatformOrderId == selectList[j])
          isE = true;
      }

      if (!isE)//不存在
        newOrderList.push(orderList[i]);
    }


    this.orderListCheckboxClose();//清除勾选

    //刷新页面
    if (newOrderList.length == 0)
      this.loadList();
    else {
      var orderStatus = this.state.orderStatus;
      for (let i = 0; i < orderStatus.length; i++) {
        if (orderStatus[i].active == true) {
          var number = orderStatus[i].num;
          orderStatus[i].num = number - (orderList.length - newOrderList.length);
          break;
        }
      }

      this.setState({
        orderList: newOrderList,
        selectOrderList: [],
        selectPurchaseOrderList: [],
        orderStatus: orderStatus
      });//从页面中移除
    }

  }

  //清除勾选
  orderListCheckboxClose = () => {
    $("#orderList_table tr input[type=checkbox]").prop('checked', false);


    $("#allCheck_id_Below").prop("checked", false);//下面的按钮点击
    $("#allCheck_id_Above").prop("checked", false);//上面的按钮点击

    this.setState({ selectOrderList: [] });
  }



  //局部更新单个订单
  UpdateSingleOrder = (productId) => {
    var shopid = this.state.selectShopId;
    let obj = this.loadOrderData(shopid);
    obj.PlatformOrderId = this.state.tempPlatformOrderId;

    var that = this;
    var shopName = this.state.selectShopName;;
    requests({
      url: "/PurchaseOrder/GetSingleOrder",
      data: obj,
      success: (res) => {
        that.setState({ isLoading: false });
        if (res.Success) {
          var orderList = that.state.orderList;
          var productID = productId || that.state.TempSelectProduct.PlatformId;
          var orderStatusIndex = that.state.orderStatusIndex;
          res.Data.ShopName = shopName;
          res.Data.SellerOrder.LastShipTimeValue = "";

          if (app.isNotNull(res.Data.SellerOrder.LastShipTime) && (orderStatusIndex == 0 || orderStatusIndex == 1 || orderStatusIndex == 2)) {
            var nowTime = new Date().getTime();
            var LastTime = new Date(res.Data.SellerOrder.LastShipTime).getTime();
            var LastShipTime = LastTime - nowTime;

            if (LastShipTime < 43200000)//小于12小时都标红色
              res.Data.SellerOrder.LastShipTimeIsRed = true;

            if (LastShipTime > 0)
              res.Data.SellerOrder.LastShipTimeValue = millisecondToDate(LastShipTime);
            else {
              res.Data.SellerOrder.LastShipTimeValue = "已超时 " + millisecondToDate(-LastShipTime);
              res.Data.SellerOrder.LastShipTimeIsEnd = true;
            }
          }

          for (let n = 0; n < orderList.length; n++) {
            if (orderList[n].SellerOrder.PlatformOrderId == that.state.tempPlatformOrderId && orderList[n].SellerOrder.OrderItems[0].ProductID == productID) {
              orderList[n] = res.Data;
            }
          }

          that.setState({ orderList: orderList });
        } else {
          app.MessageShow('error', "局部更新订单失败：" + res.Message);
        }
      }
    });
  }


  //确认采购单  --请求接口
  createPurchaseOrder(params) {
    // var data = {
    //   OrderCodeList: this.state.selectOrderList,
    //   ShopId: this.state.selectShopId,
    //   IsNewVersion:true,
    // }

    var data = {
      OrderCodeList: this.state.selectOrderList,
      NotGenerateRetureOrderItem: this.state.notGenerateRetureOrderItem,
      ShopId:this.state.newSelectShopId,
      IsNewVersion:true,
      IsIgnoreLimitExpressly:this.state.isIgnoreLimitExpressly,
      IsIgnoreLimitExpresslyWindows:this.state.isIgnoreLimitExpresslyWindows,
      ...params
    }
  
    this.setState({ isLoading: true, loadingTitle: params? '确认私域推单中...':'确认采购单中...' });
    var that = this;
    app.requests({
      url: "/PurchaseOrder/CreateOrder",
      data: data,
      success: function (res) {

        if (res.RequestError == true)//请求失效了。isLoading关闭看需求写
        {
          that.setState({ isLoading: false });
          return;
        }

        if (res.Success) {
          var taskCode = res.Data;
          var createOrderTaskCode = { TaskCode: taskCode, Ratio: 0 };
          that.setState({ createOrderTaskCode: createOrderTaskCode });

          setTimeout(() => {
            that.createOrderTask(params);
          }, 1000);
        } else {
          app.MessageShow('error', "错误信息：" + res.Message);
          that.setState({ isLoading: false });
        }
      },
    });

  }


  createOrderTask = (params) => {
    var createOrderTaskCode = this.state.createOrderTaskCode;
    var taskCode = createOrderTaskCode.TaskCode;


    var that = this;
    app.requests({
      url: "/Common/GetZhuKeReqTask",
      data: { TaskCode: taskCode },
      success: function (res) {
        if (res.RequestError == true)//请求失效了。isLoading关闭看需求写
        {
          that.setState({ isLoading: false });
          return;
        }

        if (res.Success) {
          var dates = res.Data;
          if (app.isNotNull(dates.FinishedTime)) 
          {
            that.setState({ isLoading: false, createOrderTaskCode: { TaskCode: '', Ratio: 0 } });

            if (dates.Status == "Error" &&  app.isNotNull(dates.ErrorMsg)) 
            {
              var selectShopPlatformType = that.state.selectShopPlatformType;

              //if (that.state.environmentNumber == 5 || that.state.environmentNumber == 1) 
              //{
               if (selectShopPlatformType == 'XiaoHongShu'&& dates.RspContent== "NoEncryptError") {
                  //that.setState({ noEncryptErrorDialog: true, encryErrorMessage: dates.ErrorMsg });
                  that.loadList();
                }
               else if (selectShopPlatformType == 'TouTiao'&& dates.RspContent== "NoEncryptError") {
                  var token = localStorage.getItem("isIgnoreLimitExpressly_"+that.state.selectShopId) || null;
                  if (token == null && token == undefined) {
                       that.setState({ noEncryptErrorDialog: true, encryErrorMessage: dates.ErrorMsg });
                  }else{
                     that.loadList();
                  }
                }
                else if (selectShopPlatformType == 'TouTiao'
                  && (dates.ErrorMsg.includes('请停止非必要的解密，12小时内自动回复') || dates.ErrorMsg.includes('额度') || dates.ErrorMsg.includes('环境安全风险'))) {
                  that.setState({ encryFialdDialog: true, encryErrorMessage: dates.ErrorMsg });
                }
                else if (selectShopPlatformType == 'KuaiShou' && (dates.ErrorMsg.includes('额度') || dates.ErrorMsg.includes('解密'))) {
                  //that.setState({ encryFialdDialog: true, encryErrorMessage: dates.ErrorMsg });
                  that.loadList();
                }
                else if (selectShopPlatformType == 'TouTiao' && (dates.ErrorMsg.includes('中转订单') && dates.ErrorMsg.includes('密文'))) {
                  that.setState({ encryFialdDialogByZhongZhuan: true, encryErrorMessage: dates.ErrorMsg });
                }
                else if (selectShopPlatformType == 'KuaiShou' && (dates.ErrorMsg.includes('中转订单') && dates.ErrorMsg.includes('密文'))) {
                   that.setState({ encryFialdDialogByZhongZhuan: true, encryErrorMessage: dates.ErrorMsg });
                }
                else {
                  that.setState({ isShowCommonError: true, showCommonErrorMessage: dates.ErrorMsg });//统一用弹窗
                }
              //} else {
              //  that.setState({ isShowCommonError: true, showCommonErrorMessage: dates.ErrorMsg });//统一用弹窗
              //}
            }
            else if (dates.Status == "Error" && dates.RspContent == null) {
              app.MessageShow('error', `确认${params ? '私域推单': '采购单'}任务已处理，失败原因:RspConten is null`, 3000);

            } 
             else if (dates.Status == "Error" && dates.RspContent == null) {
              app.MessageShow('error', `确认${params ? '私域推单': '采购单'}任务已处理，失败原因:RspConten is null`, 3000);

            } else {
              var rspContentJson = JSON.parse(dates.RspContent);
              var list = rspContentJson.DataList;
              var isOpen = rspContentJson.IsOpen;
              if (list == null || list == undefined)
                list = [];

              var errorList = [];//全部成功
              var successList = [];
              for (let i = 0; i < list.length; i++) {
                var resJson = list[i];
                if (resJson.IsSuccess == false)
                  errorList.push(resJson);
                else
                  successList.push(resJson);
              }

              //优先显示错误列表，其次再显示  自动代扣的检测
              if (errorList.length > 0) {
                app.MessageShow('notice',
                  <div>
                    成功<span className='defColor'>{successList.length}</span>笔，
                    失败<span className='dangerColor'>{errorList.length}</span>笔。
                    失败的可在订单列表查看原因，然后单独确认采购单
                  </div>
                )
                //that.setState({ isShowModalByCreateOrderError: true, createOrderError: errorList });
                return;
              }

              //成功后，从列表中移除,不管有没有开通
              //that.succeedOrderCodeList();

              that.loadList();//刷新页面,确认采购单，不用that.succeedOrderCodeList()，因为确认采购单后，订单还在当前页面，只是刷新页面即可
              app.MessageShow('success', `${params ? '私域推单': '采购单'}创建成功。`, 2200);

              //没有错误的列表(errorList) ，没有开通自动代扣(isOpen),没有点击【不再提醒】
              if (errorList.length == 0 && isOpen == false && that.state.isRemindOpen < 8)
                that.setState({ isShowModalByNotOpen: true, isRemindOpen: that.state.isRemindOpen + 1 });

            }
          } else {
            //任务未执行完，继续轮训
            setTimeout(() => {
              that.createOrderTask();
            }, 1000);
          }
        } else {
          that.setState({ isShowCommonError: true, showCommonErrorMessage: res.Message });

          that.setState({ isLoading: false, createOrderTaskCode: { TaskCode: '', Ratio: 0 } });
        }
      },
    });


  }

  //#endregion


  //#region 确认采购单，未映射的弹窗遮罩 （折叠）

  //确认关联操作，保存
  sureRelevanceRequest = () => {

    var selectProduct = this.state.selectProduct;
    var skuMappingList = [];
    var skuList = selectProduct.Skus;

    for (let i = 0; i < skuList.length; i++) {
      if (skuList[i].SupplierSkuList == undefined || skuList[i].SupplierSkuList == null || skuList[i].SupplierSkuList[0].SupplierSkuId == "") {
        continue;
      }

      for (let n = 0; n < skuList[i].SupplierSkuList.length; n++) {
        if (skuList[i].SupplierSkuList[n].SupplierSkuId == undefined || skuList[i].SupplierSkuList[n].SupplierSkuId == null ||
          skuList[i].SupplierSkuList[n].SupplierSkuId == "" || skuList[i].SupplierSkuList[n].MappingCount <= 0) {
          continue;
        }

        skuMappingList.push({
          SkuId: skuList[i].SkuId,
          SupplierSkuId: skuList[i].SupplierSkuList[n].SupplierSkuId,
          MappingCount: skuList[i].SupplierSkuList[n].MappingCount
        });
      }
    }

    if (skuMappingList.length <= 0) {
      app.MessageShow("warning", '规格不能选择空，当前选择是无效的！', 1500);
      return false;
    }

    var dataJson = {
      SupplierProductId: this.state.supplierProductId,
      SourcePlatform: this.state.selectSourcePlatform,
      SupplierMemberId: '',
      SupplierLoginId: this.state.supplierLoginId,
      ProductId: selectProduct.PlatformId,
      TargetShopId: selectProduct.ShopId,
      SkuMappings: skuMappingList,
      TargetShopPt: this.state.selectShopPlatformType,
    }


    var that = this;
    this.setState({ isLoading: true, loadingTitle: '保存规格中...' });
    app.requests({
      url: "/BatchDistribution/RelateProduct",
      data: dataJson,
      success: function (res) {
        that.setState({ isLoading: false });
        if (res.RequestError == true)//请求失效了。isLoading关闭看需求写
          return;

        if (res.Success) {
          app.MessageShow("success", '映射成功！', 1500);

          var productId = dataJson.ProductId;
          if (skuMappingList == null || skuMappingList == undefined)
            skuMappingList = [];

          var orderList = that.state.orderList;
          for (let i = 0; i < orderList.length; i++) {
            var orderItemList = orderList[i].SellerOrder.OrderItems;
            for (let j = 0; j < orderItemList.length; j++) {
              if (orderItemList[j].ProductID == productId) {
                for (let k = 0; k < skuMappingList.length; k++) {
                  if (skuMappingList[k].SupplierSkuId != undefined && skuMappingList[k].SupplierSkuId != null && skuMappingList[k].SupplierSkuId != ""
                    && skuMappingList[k].SkuId == orderItemList[j].SkuID)
                    orderItemList[j].IsMapping = true;
                }
              }
            }
            orderList[i].SellerOrder.OrderItems = orderItemList;
          }

          that.setState({ orderList: orderList });


          that.closeProductMapping();

        } else {
          app.MessageShow('error', "关联映射失败：" + res.Message);
        }
      },
    });


  }


  // ==========================确认采购单 遮罩弹框 end ========================
  //#endregion



  //#region 支付相关的 （折叠）
  //==============================================支付相关的==============================================================


  //采购单支付请求
  orderPayment = (orderCode, confirm) => {
    var selectOrderList = [];
    if (orderCode == null || orderCode == undefined || orderCode == "")
      selectOrderList = this.state.selectOrderList;
    else
      selectOrderList.push(orderCode);


    if (selectOrderList.length == 0) {
      app.MessageShow("notice", "请选择订单!");
      return;
    }

    var buyerCodeList = this.getListPurchaseOrderCode(selectOrderList, true);
    if (buyerCodeList.length > 0) {
      var orderList = this.state.orderList.map(x => x.BuyerOrders).flat().filter(x => x && x.BuyerOrder && x.BuyerOrder.OrderTags);

      let findChangeAddressOrders = [];
      for (let index = 0; index < buyerCodeList.length; index++) {
        const buyerCode = buyerCodeList[index];
        const item = orderList.find(x => x.BuyerOrder.OrderCode == buyerCode);
        if (!item) continue;

        let changeAddressTag = item.BuyerOrder.OrderTags.find(x => x.Tag == 'OrderAddressUpdate' || x.Tag == 'OrderReceiverUpdate');
        if (changeAddressTag)
          findChangeAddressOrders.push(buyerCode);
      }

      if (findChangeAddressOrders.length > 0 && findChangeAddressOrders.length == buyerCodeList.length && !confirm) {
        this.setState({ allOrderPayChangeAddressDialog: true })
        return;
      }
      else if (findChangeAddressOrders.length > 0 && !confirm) {
        this.setState({ orderPayChangeAddressDialog: true })
        return;
      }
      buyerCodeList = buyerCodeList.filter(x => !findChangeAddressOrders.includes(x))
    }

    var buyerOrders = this.state.orderList.map(s => s.BuyerOrders.map(x => x.BuyerOrder)).flat().filter(x => x)
    buyerOrders = buyerOrders.filter(x => buyerCodeList.includes(x.OrderCode))

    // const hasAlibabaOrder = buyerOrders.findIndex(x => x.PlatformType == "AlibabaZhuKe") > -1
    // const hasTaoteOrder = buyerOrders.findIndex(x => x.PlatformType == "TaoteZhuKe") > -1

    if (buyerCodeList.length == 0) {
      app.MessageShow("notice", "选择的订单没有待付款的采购单！");
      return;
    }

    var alibabaOrderList = buyerOrders.filter(x => x.PlatformType == "AlibabaZhuKe");
    var taoTeOrderList = buyerOrders.filter(x => x.PlatformType == "TaoteZhuKe");

    // if(taoTeOrderList.length > 40){
    //   app.MessageShow("notice", "淘特批量手动付款最多只支持一次40笔，请减少数量");
    //   return;
    // }
    if (alibabaOrderList.length > 0 && taoTeOrderList.length > 0) {
      var buyerCodeListByAli = [];
      var buyerCodeListByTaote = [];
      alibabaOrderList.forEach(f => {
        buyerCodeListByAli.push(f.OrderCode);
      });
      taoTeOrderList.forEach(f => {
        buyerCodeListByTaote.push(f.OrderCode);
      });

      this.setState({
        isShowMoreTypePay: true,
        aliPayOrderCodeList: buyerCodeListByAli,
        taoTePayOrderCodeList: buyerCodeListByTaote,
        selectPurchaseOrderList: buyerCodeListByAli
      })
      //messageShow('多个采购平台订单无法一起支付! 请选择采购平台后分别支付!','info');
      return;
    } else {
      if (taoTeOrderList.length > 0) {
        app.MessageShow('warning', "当前版本不支持对非1688货源订单进行操作！");
        this.taotePayUrl(buyerCodeList);//buyerCodeList 都是淘特的buyercode
        return;
      }

      //buyerCodeList 都是阿里的buyercode
      this.setState({ selectOrderList: selectOrderList, selectPurchaseOrderList: buyerCodeList });
      if (buyerCodeList.length > 50 && this.state.isRemindThirty) {
        this.setState({ isShowModalByBatchOpen: true });
        return;
      }

      if (buyerCodeList.length == 0) {
        app.MessageShow('warning', "选择的订单没有待付款的采购单！");
        return;
      }

      if (buyerCodeList.length > 50) {
        this.protocalPayOpenConfirm(true);
      } else {
        setTimeout(() => {
          this.getOrderPayType();
        }, 0);
      }
    }
  }




  //多货源时，选择了淘特支付。回来原来的支付方式taotePayUrl
  moreTypePayByTaoteButton = () => {
    this.taotePayUrl(this.state.taoTePayOrderCodeList);
  }




  //淘特支付
  async taotePayUrl(orderCodes) {
    this.setState({ isLoading: true, loadingTitle: '获取支付二维码中...' });
    const data = { OrderCodes: orderCodes }
    const res = await GetPayUrlRequest(data);
    this.setState({ isLoading: false, loadingTitle: '' });
    if (!res.Success) {
      app.MessageShow('error', "获取支付二维码异常：" + res.Message)
      return;
    }
    if (!res.Data && res.Data.PayUrlMap && res.Data.PayUrlMap['TaoteZhuKe']) {
      app.MessageShow('error', "获取支付二维码")
      return;
    }
    const payModel = res.Data.PayUrlMap['TaoteZhuKe'];
    this.state.payModel.PayUrl = payModel.PayUrl
    this.state.payModel.Code = payModel.Code
    this.state.payModel.ExpireTime = payModel.ExpireTime
    this.state.payModel.qrcodeShow = true;
    this.state.payModel.OrderCodes = orderCodes;
    this.setState({}, () => {
      var authTimeSpan = (payModel.ExpireTime - new Date().valueOf() - 1000) / 1000;
      authTimeSpan = Math.floor(authTimeSpan);

      this.qrCountDown(authTimeSpan);
      setTimeout(() => {
        this.getPayReusltPoll();
      }, 3000)
    })
  }
  //关闭支付二维码
  closeQrCodeInfo() {
    this.state.payModel.PayUrl = ''
    this.state.payModel.Code = ''
    this.state.payModel.ExpireTime = ''
    this.state.payModel.qrcodeShow = false;
    this.setState({})
  }
  //二维码有效期倒计时
  qrCountDown(timespan) {
    $("#authTimespan").text(timespan);
    this.state.payModel.timespan = timespan
    if (timespan == 0 || !this.state.payModel.PayUrl) {
      this.closeQrCodeInfo(); return;
    }
    this.setState({})
    timespan = timespan - 1;
    setTimeout(() => { this.qrCountDown(timespan); }, 1000)
  }
  //
  async getPayReusltPoll() {
    if (this.state.payModel.qrcodeShow == false || this.state.payModel.timespan < 1)
      return

    const data = {
      OrderCodes: this.state.payModel.OrderCodes,
      Code: this.state.payModel.Code
    }
    var res = await GetPayResultRequest(data);
    if (res.Success) {
      if (res.Data.PaySuccess == true) {
        this.closeQrCodeInfo();
        app.MessageShow('success', '支付成功');
        this.state.orderStatusIndex = 2;
        const orderStatus = this.state.orderStatus.find(x => x.title == "待发货")
        this.setState({})
        setTimeout(() => { this.changeNav(orderStatus) }, 2500)
      }
      else if (res.Data.PayFail == true) {
        this.closeQrCodeInfo();
        app.MessageShow('error', '支付失败');
      }
      else if (res.Data.PayStatus == 'process' || res.Data.PayStatus == 'init') {
        setTimeout(() => { this.getPayReusltPoll() }, 2000);
      } else {
        app.MessageShow('error', '支付失败');
        this.closeQrCodeInfo();
      }
    } else {
      setTimeout(() => { this.getPayReusltPoll() }, 1500);
    }
  }



  //是否开通（自动代扣）  --请求接口
  protocalPayOpenConfirm = (isPay) => {

    this.setState({ isLoading: true, loadingTitle: '获取开通信息...' });

    var that = this;
    app.requests({
      url: "/PurchaseOrder/ProtocalPayOpenConfirm",
      data: {},
      success: function (res) {
        //关闭动画
        that.setState({ isLoading: false });
        if (res.RequestError == true)//请求失效了。isLoading关闭看需求写
          return;

        if (res.Success) {
          var isOpen = res.Data;
          that.setState({ isShowModalByVerifyOpen: false });
          if (isOpen) {
            if (isPay == true)
              that.getOrderPayType();
            else
              app.MessageShow("notice", "已开通。");
          }
          else {
            if (isPay == true)
              that.setState({ isShowModalByNotOpen: true });
            else
              app.MessageShow("notice", "开通失败");
          }

        } else {
          app.MessageShow('error', "获取店铺列表错误：" + res.Message);
        }
      },
    });
  }





  //获取【支付方式】  --请求接口
  getOrderPayType = () => {
    var buyerIdList = this.state.selectPurchaseOrderList;

    var data = {
      BuyerOrderCodes: buyerIdList
    }

    this.setState({ isLoading: true, loadingTitle: '获取支付方式中...' });
    var that = this;
    app.requests({
      url: "/PurchaseOrder/GetOrderPayType",
      data: data,
      success: function (res) {
        //关闭动画
        that.setState({ isLoading: false });
        if (res.RequestError == true)//请求失效了。isLoading关闭看需求写
          return;

        if (res.Success) {

          var faildOrderIds = res.Data.PayTypeQueryFaildOrderIds == undefined ? [] : res.Data.PayTypeQueryFaildOrderIds;//获取支付渠道失败的订单
          var isOpenButton = res.Data.ProtocolPayIsOpen == undefined ? false : res.Data.ProtocolPayIsOpen;//是否显示自动代付按钮
          var notWaitPayIds = res.Data.NotWaitPayIds == undefined ? [] : res.Data.NotWaitPayIds;
          var payChannels = res.Data.PayChannels == undefined ? [] : res.Data.PayChannels;//后台预留的数组。也是获取失败的。
          var paymentMoney = res.Data.PaymentMoney;//后台预留的数组。也是获取失败的。

          if (faildOrderIds.length > 0 || payChannels.length > 0 || notWaitPayIds.length > 0) {
            //获取错误列表   --提示框
            that.setState({
              getPaymentErrorFaildOrderList: faildOrderIds,
              getPaymentErrorNotWaitPayIds: notWaitPayIds,
              getPaymentErrorPayChannelsList: payChannels,
              isShowModalBySelectPaymentError: true,
            })
          } else {
            that.setState({
              isShowAutoPayButton: isOpenButton,
              isShowModalBySelectPayment: true,
              showModalByPaymentPaymentMoney: paymentMoney,
            });
          }

        } else
          app.MessageShow('error', "错误信息：" + res.Message);
      },
    });
  }



  //选择付款方式，弹框 --手动支付
  selectPaymentShowModalByManual = () => {

    var buyerIdList = this.state.selectPurchaseOrderList;
    if (buyerIdList.length > 50) {
      app.MessageShow('notice', "手动支付，不能超过50个订单");
      return;
    }

    this.setState({ isShowModalBySelectPayment: false });
    this.getOrderPayUrl();//获取支付链接
  }

  //选择付款方式，弹框 --自动支付
  selectPaymentShowModalByConfirm = () => {
    this.autoPaying();
  }


  //手动支付跳转后 弹框--确认按钮
  payUrlShowModalByConfirm = () => {
    this.setState({ isShowModalByPayUrl: false, isLoading: true });

    this.loadList();
  }

  selectPaymentShowModalByClose = () => {
    this.setState({ isShowModalBySelectPayment: false });
  }

  //自动代扣  --请求接口
  autoPaying = () => {
    var buyerIdList = this.state.selectPurchaseOrderList;
    var data = {
      BuyerOrderCodes: buyerIdList
    }
    this.setState({ isLoading: true, loadingTitle: '正在发起自动代扣...' });
    var that = this;
    app.requests({
      url: "/PurchaseOrder/AutoPay",
      data: data,
      success: function (res) {

        //关闭动画
        that.setState({ isLoading: false, isShowModalBySelectPayment: false });
        if (res.RequestError == true)//请求失效了。isLoading关闭看需求写
          return;

        if (res.Success) {
          var autoPaymentSuccessPayingOrderIds = res.Data.PayingOrderIds;
          var autoPaymentSuccessNotWaitPayIds = res.Data.NotWaitPayIds;
          var autoPaymentSuccessFaildOrderIds = res.Data.PayTypeQueryFaildOrderIds;

          if (autoPaymentSuccessPayingOrderIds.length == 0) {
            that.setState({ isShowModalByAutoPaymentError: true });
          } else {
            that.setState({
              isShowModalByAutoPaymentSuccess: true,
              autoPaymentSuccessPayingOrderIds: autoPaymentSuccessPayingOrderIds,
              autoPaymentSuccessNotWaitPayIds: autoPaymentSuccessNotWaitPayIds,
              autoPaymentSuccessFaildOrderIds: autoPaymentSuccessFaildOrderIds
            });
          }

        } else
          app.MessageShow('error', "错误信息：" + res.Message);
      },
    });
  }

  //自动代扣失败，弹框 --关闭
  autoPaymentErrorShowModalByClose = () => {
    this.setState({ isShowModalByAutoPaymentError: false });
  }

  //自动代扣失败，弹框 --确认  --转手动支付
  autoPaymentErrorShowModalByConfirm = () => {
    var buyerIdList = this.state.selectPurchaseOrderList;
    if (buyerIdList.length > 50) {
      app.MessageShow('notice', "手动支付，不能超过50个订单");
      return;
    }
    this.setState({ isShowModalByAutoPaymentError: false });//关闭失败的弹框

    //自动代扣失败后，可以选择手动支付
    //获取支付链接
    this.getOrderPayUrl();
  }

  //自动代扣成功，弹框 --确认 
  autoPaymentSuccessShowModalByConfirm = () => {
    this.setState({ isShowModalByAutoPaymentSuccess: false, isLoading: true });

    this.loadList();
  }



  //获取订单的【支付链接】  --请求接口
  getOrderPayUrl = () => {
    var buyerIdList = this.state.selectPurchaseOrderList;
    var data = {
      BuyerOrderCodes: buyerIdList,
      SystemVersions: 'pc'
    }

    this.setState({ isLoading: true, loadingTitle: '获取支付链接中...' });
    var that = this;
    app.requests({
      url: "/PurchaseOrder/getOrderPayUrl",
      data: data,
      success: function (res) {

        //关闭动画
        that.setState({ isLoading: false });
        if (res.RequestError == true)//请求失效了。isLoading关闭看需求写
          return;

        if (res.Success) {
          var payUrl = res.Data.PayUrl;
          var faildOrderIds = res.Data.PayUrlQueryFaildOrderIds;//链接获取失败的订单
          var notSameOrderIds = res.Data.PayChannelNotSameOrderIds;//支付渠道不一致的订单
          if (faildOrderIds.length > 0 || notSameOrderIds.length > 0) {
            //获取错误列表   --提示框
            that.setState({
              getPayUrlErrorFaildOrderList: faildOrderIds,
              getPayUrlErrorPayChannelsList: notSameOrderIds,
              isShowModalByPayUrlError: true,
            })
          } else {
            var url = decodeURIComponent(payUrl);
            window.open(url);

            setTimeout(() => {
              that.setState({ isShowModalByPayUrl: true });
            }, 1000);
          }

        } else
          app.MessageShow('error', "错误信息：" + res.Message);
      },
    });

  }


  // 批量开启时，弹框 --关闭（不再提醒）
  batchOpenShowModalByClose = () => {
    //关闭弹框，并且后续不提醒
    this.setState({ isShowModalByBatchOpen: false, isRemindThirty: false });
  }

  // 批量开启时，弹框 --确认
  batchOpenShowModalByConfirm = () => {

    this.setState({ isRemindThirty: false, isShowModalByBatchOpen: false });
    setTimeout(() => {
      this.orderPayment();
    }, 0);

    setTimeout(() => {
      this.setState({ isRemindThirty: true });
    }, 1000);
  }

  //==============================================支付相关的  end==============================================================
  //#endregion


  //#region 订单详情页面（官方） （折叠）
  //订单详情页面（官方）
  async orderDetailLink(buyerOrder, isInspect, buyerPlatformOrderId, buyerPlatformOrderCode, sellerOrderId) {
    let orderId = buyerOrder.PlatformOrderId;
    if (buyerOrder && buyerOrder.PlatformType == "TaoteZhuKe") {
      if (isInspect == true) {
        var that = this;
        setTimeout(() => {
          that.setState({
            isShowModalByCancelExamine: true,
            buyerPlatformOrder: buyerOrder,
            buyerPlatformOrderId: buyerPlatformOrderId,
            buyerPlatformOrderCode: buyerPlatformOrderCode,
            detailsPlatformOrderId: sellerOrderId
          });
        }, 1000);
      }
      var taoteurl = 'https://trade.taobao.com/trade/detail/trade_order_detail.htm?biz_order_id=' + orderId;
      window.open(taoteurl);
      return;
    } else if (buyerOrder && buyerOrder.IsPifatuan == true && isInspect == true) {
      this.cancelPurchaseOrder(buyerPlatformOrderCode);
      return;
    }

    if (isInspect == true) {
      var that = this;
      setTimeout(() => {
        that.setState({
          isShowModalByCancelExamine: true,
          buyerPlatformOrderId: buyerPlatformOrderId,
          buyerPlatformOrder: buyerOrder,
          buyerPlatformOrderCode: buyerPlatformOrderCode,
          detailsPlatformOrderId: sellerOrderId
        });
      }, 1000);
    }
    var url = "https://trade.1688.com/order/new_step_order_detail.htm?orderId=" + orderId;

    window.open(url);
  }

  cancelPrivateDomain = (OrderCode) => {
    this.setState({
      isCancelPrivateDomain: true,
      OrderCode: OrderCode
    })
  }
  confirmReceipt = (type,OrderCode) => {
    let params = {}
    if (type == 2) {
      if (!OrderCode) return;
      params = {PurchaseOrderCode: JSON.stringify([OrderCode])}
    } else {
      if (this.state.selectOrderList.length == 0) {
        app.MessageShow("notice", "请选择订单!");
        return;
      }
      let list = [];
      this.state.orderList.map(item => {
        item.BuyerOrders.map(item1 => {
          if (item1.BuyerOrder.PlatformStatus == 'waitbuyerreceive') {
            list.push(item1.BuyerOrder.OrderCode);
          }
        })
      });
      params = {PurchaseOrderCode: JSON.stringify(list)};
    }
    ConfirmGoodsXiaoDianPurchaseOrder(params).then((res) => {
      if (res.Success) {
        app.MessageShow('success', '操作成功。', 2200);
        this.loadList();
      }
    });
  }
  cancelPrivateDomainConfirm = () => {
    const { OrderCode } = this.state;
    if (!OrderCode) return;
    CancelXiaoDianPurchaseOrder({PurchaseOrderCode: OrderCode}).then((res) => {
      if (res.Success) {
        this.setState({
          isCancelPrivateDomain: false,
          OrderCode: ''
        });
        app.MessageShow('success', '操作成功。', 2200);
        this.loadList();
      }
    });
  }

  //已取消  --点击确认
  cancelExamineShowModalByConfirm = () => {
    this.setState({ isShowModalByCancelExamine: false, isLoading: true });
    //this.loadList();
    this.syncOneOrder("buyer", "cancelButton");
  }

  //同步订单后，再查一次。商品详情页面
  syncOneOrder = (orderType, operation) => {
    var buyerPlatformOrderId = this.state.buyerPlatformOrderId;//平台订id
    var buyerPlatformOrderCode = this.state.buyerPlatformOrderCode;//平台订单code
    var detailsPlatformOrderId = this.state.detailsPlatformOrderId;//采购单
    var data = { PlatformOrderIds: '', ShopId: '', PurchaseOrderCode: '', PurchaseOrderId: '' };
    var url = "";
    if (orderType == "buyer") {
      data.PurchaseOrderId = buyerPlatformOrderId;
      data.PurchaseOrderCode = buyerPlatformOrderCode;
      url = "/PurchaseOrder/CancelPurchaseOrderConfirm"
    } else {
      data.PlatformOrderIds = detailsPlatformOrderId;
      data.ShopId = this.state.newSelectShopId;
      url = "/Order/SyncSingleOrder";
    }


    this.setState({ isLoading: true, loadingTitle: '检测订单...' });
    var that = this;
    app.requests({
      url: url,
      data: data,
      success: function (res) {

        //关闭动画
        that.setState({ isLoading: false });
        if (res.RequestError == true)//请求失效了。isLoading关闭看需求写
          return;

        if (res.Success) {
          var list = res.Data;
          if (list != null && list.length > 0) {
            var order = list[0];
            //说明取消成功，重新查询，（取消成功后会变成待确认）
            if (operation == "cancelButton") {
              if (order.PlatformStatus == "cancel") {
                app.MessageShow("success", "取消成功，准备刷新页面", 2100);
                setTimeout(() => {
                  that.orderStatusChangeNav(0);
                }, 1000);
              } else
                app.MessageShow("notice", "订单没有取消成功！", 2100);
            }

            //重新发货的操作
            if (operation == "reOnlineSendButton") {
              //说明重新发货，所有的平台订单已经发货成功
              //发货成功后，触发查询按钮即可，不触发切换的导航栏
              if (order.PlatformStatus == "waitbuyerreceive") {

                //that.orderStatusChangeNav(2);

                $("#queryOrderButton").click();
              }



            }

          }

        } else
          app.MessageShow('error', "错误信息：" + res.Message);
      },
    });


  }


  orderStatusChangeNav(id) {
    var orderStatus = this.state.orderStatus;
    var item = null;
    for (var i = 0; i < orderStatus.length; i++) {
      if (orderStatus[i].id == id) {
        orderStatus[i].active = true;
        item = orderStatus[i];
      } else {
        orderStatus[i].active = false;
      }
    }
    this.substateCheckboxEmpty();//清空子状态勾选

    this.setState({
      orderStatus: orderStatus,
      orderStatusIndex: id,
      refundType: "",
      orderSubstate: ""
    }, () => {
      this.changeNav(item);//触发切换导航事件
    })
  }

  //#endregion


  //#region 标签相关
  //加载订单标签
  loadOrderTags(orders, shopId) {
    if (!orders || orders.length == 0)
      return;

    const oiCodes = [];
    orders.forEach(order => {
      oiCodes.push(order.SellerOrder.OrderCode);
    })
    const data = {
      ShopId: shopId,
      OiCodes: oiCodes
    }

    OrderTagsListRequest(data).then(res => {
      if (res.Success) {
        const orderTags = res.Data || [];
        orders.forEach(order => {
          const tags = orderTags.filter(e => e.OiCode == order.SellerOrder.OrderCode);
          if (order.SellerOrder.IsShipHold == true) {
            tags.push({
              OiCode: order.SellerOrder.OrderCode,
              Platform: order.SellerOrder.PlatformType,
              Tag: 'PddShipHold'
            });
          }
          //模拟订单标签
          // tags.push({
          //   OiCode:order.SellerOrder.OrderCode,
          //   Platform:order.SellerOrder.PlatformType,
          //   Tag:'OrderAddressUpdate'
          // });

          const ksAddressUpdateTag = tags.find(x => x.Tag == 'OrderAddressUpdate' || x.Tag == 'OrderReceiverUpdate');
          if (ksAddressUpdateTag && order.BuyerOrders && order.BuyerOrders.length > 0) {
            order.BuyerOrders.filter(item => item.BuyerOrder).forEach(item => {
              if (item.BuyerOrder.PlatformStatus == 'waitsellersend' || item.BuyerOrder.PlatformStatus == 'waitbuyerpay') {
                item.BuyerOrder.OrderTags = [ksAddressUpdateTag];
              }
            });
          }

          const ksSpliceGroupTag = tags.find(x => x.Tag == 'KsSpliceGroupTag');
          if (ksSpliceGroupTag)
            order.SellerOrder.IsSpliceGroupTag = true;

          //抖音中转
          const touTiaoLogisticsTransitTag = tags.find(x => x.Tag == 'TouTiaoLogisticsTransitTag');
          if (touTiaoLogisticsTransitTag)
            order.SellerOrder.IsOrderLogisticsTransitTag = true;

          //快手中转
          const ksLogisticsTransitTag = tags.find(x => x.Tag == 'KsLogisticsTransitTag');
          if (ksLogisticsTransitTag)
             order.SellerOrder.IsOrderKsLogisticsTransitTag = true;

          //快手顺丰
          const ksShunfengTag = tags.find(x => x.Tag == 'KsShunfengTag');
          if (ksShunfengTag)
             order.SellerOrder.IsOrderKsShunfengTag = true;
   


          //快手中转
          const pddHomeDeliveryDoorTag = tags.find(x => x.Tag == 'PddHomeDeliveryDoorTag');
          if (pddHomeDeliveryDoorTag)
             order.SellerOrder.IsPddHomeDeliveryDoorTag = true;
             //小红书
          const xiaoHongShuHomeDeliveryTag = tags.find(x => x.Tag == 'XiaoHongShuHomeDeliveryTag');
          if (xiaoHongShuHomeDeliveryTag)
             order.SellerOrder.IsXiaoHongShuHomeDeliveryTag = true;

          const touTiaoChooseDeliveryTag = tags.find(x => x.Tag == 'TouTiaoChooseDeliveryTag' );
          if(touTiaoChooseDeliveryTag)
                order.SellerOrder.IsTouTiaoChooseDeliveryTag=true;


          const pddLocalDepotTag = tags.find(x => x.Tag == 'PddLocalDepotTag' );
          if(pddLocalDepotTag)
                order.SellerOrder.IsPddLocalDepotTag=true;


          var touTiaoSFSend = tags.find(x => x.Tag == 'TouTiaoSFSend');
          //规格的维度打标(抖音顺丰包邮)
          if (touTiaoSFSend) {
            var tagValue = touTiaoSFSend.TagValue;
            tagValue = tagValue.replace("\\", "").replace("\\", "").replace("\\", "").replace("\\", "");
            var tagValueList = JSON.parse(tagValue);
            var orderItemList = order.SellerOrder.OrderItems;
            orderItemList.forEach(f => {
              var subItem = tagValueList.find(x => x == f.SubItemID);
              if (subItem)
                f.IsTouTiaoSFSend = 1;//商品打标
            });
            order.SellerOrder.IsTouTiaoSFSend = 1;//订单维度标记，用于勾选
          }

          order.SellerOrder.OrderTags = tags;
        })
        this.setState({})
      }
    });

  }
  ksRiskOrderTagClickContent(order) {
    const element =
      <div class="btrigger" style={{ width: "270px" }}>
        <span>该订单存在骗运费风险，48小时内平台会返回结果;</span>
        <div style={{ "display": "flex", "alignItems": "center" }}>
          <svg t="1656401688180" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2249" data-spm-anchor-id="a313x.7781069.0.i1" width="20" height="20"><path d="M512 178.176C327.68 178.176 178.176 327.68 178.176 512S327.68 845.824 512 845.824s333.824-149.504 333.824-333.824S696.32 178.176 512 178.176z m0 560.128c-124.928 0-226.304-101.376-226.304-226.304S387.072 285.696 512 285.696c124.928 0 226.304 101.376 226.304 226.304s-101.376 226.304-226.304 226.304z m0-345.088c-65.536 0-118.784 53.248-118.784 118.784 0 65.536 53.248 118.784 118.784 118.784 65.536 0 118.784-53.248 118.784-118.784 0-65.536-53.248-118.784-118.784-118.784z" fill="#2c2c2c" p-id="2250" data-spm-anchor-id="a313x.7781069.0.i0" class="selected"></path></svg>
          <span>没问题，清除风控标记，正常显示收件人信息</span>
        </div>
        <div style={{ "display": "flex", "alignItems": "center" }}>
          <svg t="1656401688180" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2249" data-spm-anchor-id="a313x.7781069.0.i1" width="20" height="20"><path d="M512 178.176C327.68 178.176 178.176 327.68 178.176 512S327.68 845.824 512 845.824s333.824-149.504 333.824-333.824S696.32 178.176 512 178.176z m0 560.128c-124.928 0-226.304-101.376-226.304-226.304S387.072 285.696 512 285.696c124.928 0 226.304 101.376 226.304 226.304s-101.376 226.304-226.304 226.304z m0-345.088c-65.536 0-118.784 53.248-118.784 118.784 0 65.536 53.248 118.784 118.784 118.784 65.536 0 118.784-53.248 118.784-118.784 0-65.536-53.248-118.784-118.784-118.784z" fill="#2c2c2c" p-id="2250" data-spm-anchor-id="a313x.7781069.0.i0" class="selected"></path></svg>
          <span>有问题，保留标记，并关闭订单</span>
        </div>
      </div>
    return element
  }
  pddRiskOrderTagClickContent(order) {
    const element =
      <div class="btrigger" style={{ width: "270px" }}>
        <span>该订单存在骗运费风险，48小时内平台会返回结果;</span>
        <div style={{ "display": "flex", "alignItems": "center" }}>
          <svg t="1656401688180" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2249" data-spm-anchor-id="a313x.7781069.0.i1" width="20" height="20"><path d="M512 178.176C327.68 178.176 178.176 327.68 178.176 512S327.68 845.824 512 845.824s333.824-149.504 333.824-333.824S696.32 178.176 512 178.176z m0 560.128c-124.928 0-226.304-101.376-226.304-226.304S387.072 285.696 512 285.696c124.928 0 226.304 101.376 226.304 226.304s-101.376 226.304-226.304 226.304z m0-345.088c-65.536 0-118.784 53.248-118.784 118.784 0 65.536 53.248 118.784 118.784 118.784 65.536 0 118.784-53.248 118.784-118.784 0-65.536-53.248-118.784-118.784-118.784z" fill="#2c2c2c" p-id="2250" data-spm-anchor-id="a313x.7781069.0.i0" class="selected"></path></svg>
          <span>没问题，清除风控标记，正常显示收件人信息</span>
        </div>
        <div style={{ "display": "flex", "alignItems": "center" }}>
          <svg t="1656401688180" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2249" data-spm-anchor-id="a313x.7781069.0.i1" width="20" height="20"><path d="M512 178.176C327.68 178.176 178.176 327.68 178.176 512S327.68 845.824 512 845.824s333.824-149.504 333.824-333.824S696.32 178.176 512 178.176z m0 560.128c-124.928 0-226.304-101.376-226.304-226.304S387.072 285.696 512 285.696c124.928 0 226.304 101.376 226.304 226.304s-101.376 226.304-226.304 226.304z m0-345.088c-65.536 0-118.784 53.248-118.784 118.784 0 65.536 53.248 118.784 118.784 118.784 65.536 0 118.784-53.248 118.784-118.784 0-65.536-53.248-118.784-118.784-118.784z" fill="#2c2c2c" p-id="2250" data-spm-anchor-id="a313x.7781069.0.i0" class="selected"></path></svg>
          <span>有问题，保留标记，并关闭订单</span>
        </div>
      </div>
    return element
  }
  pddShipHoldTagClickContent(order) {
    const element =
      <div>
        <p>该订单因发货地疫情影响，暂不支持发货，当疫情限制解除时，订单将重启承诺发货时间倒计时并支持发货</p>
        <div>
          前往拼多多后台查看订单详情
          <a href={'https://mms.pinduoduo.com/orders/detail?type=4399&sn=' + order.SellerOrder.PlatformOrderId} target="_blank">查看订单详情链接</a>
        </div>
      </div>
    return element
  }
  ksAddressUpdate(order, tag) {
    const element =
      <div>
        <div style={{ fontWeight: "800", marginLeft: "16px" }}>
          <p style={{ fontWeight: "800" }}>有什么影响?</p>
          <div>
            平台为避免由于下单收货人信息和实际收货信息不一致的问题带来的消费者客诉，发货前对该类订单做拦截校验。
          </div>
        </div>

        <div style={{ marginTop: "24px" }}>
          <p style={{ fontWeight: "800", marginLeft: "16px" }}>怎么解决?</p>
          <div>
            <div>

              <span><i className="dot-ZT"></i></span>【待付款】的采购单，请点击采购单右侧 <span style={{ fontWeight: "800" }}>【取消订单】</span>进行关闭采购单后再重新下单
            </div>
            <div>
              <span><i className="dot-ZT"></i></span>【待发货】的采购单，请点击采购单右侧<span style={{ fontWeight: "800" }}>【订单详情】</span> 进行申请采购单退款并且退款成功后再重新下单
            </div>
            <div>
              <span><i className="dot-ZT"></i></span>【已发货】的采购单，请与供应商协商，然后点击采购单右侧<span style={{ fontWeight: "800" }}>【订单详情】</span>申请采购单退款并且退款成功后再重新下单
            </div>
          </div>
        </div>
      </div>
    return element
  }
  orderSpliceGroup(order, tag) {
    const element =
      <div>

        <div style={{ marginTop: "24px" }}>
          <p style={{ fontWeight: "800", marginLeft: "16px" }}>有什么影响?</p>
          <div>
            <div>
              <i className="dot-ZT"></i>该订单为拼团订单，拼团中获拼团失败的订单都无收货地址信息不能下单
            </div>
          </div>
        </div>

        <div style={{ marginTop: "24px" }}>
          <p style={{ fontWeight: "800", marginLeft: "16px" }}>怎么解决?</p>
          <div>
            <div>
              <span><i className="dot-ZT"></i></span>需等待拼团成功后才会显示收货地址信息，才能进行下单发货
            </div>
          </div>
        </div>
      </div>
    return element
  }
  //中转的标签提示
  orderLogisticsTransit(order, tag) {
    const element =
      <div>
        <div style={{ marginTop: "24px" }}>
          <p style={{ fontWeight: "800", marginLeft: "16px" }}>什么是中转订单?</p>
          <div>
            <div>
              <i className="dot-ZT"></i>平台目前推出偏远地区中转服务，商家仅需将包裹邮寄。商家仅需将包裹邮寄至中转仓即可，无需将包裹邮寄至消费者地址。平台在西安建立中转仓，即将新疆的物流包裹分为2段，A段：发货地--西安中转仓，B段：西安中转仓--商家收货地址。
            </div>
          </div>
        </div>

        <div style={{ marginTop: "24px" }}>
          <p style={{ fontWeight: "800", marginLeft: "16px" }}>有什么影响?</p>
          <div>
            <div>
              <span><i className="dot-ZT"></i></span>中转订单不支持合并下单，仅显示中转仓地址，如需查看完整地址或是物流详情，请至店铺后台查看<a href={'https://fxg.jinritemai.com/ffa/morder/order/detail?id=' + order.SellerOrder.PlatformOrderId} target='_blank'>订单详情</a>
            </div>
            <div>
              <span><i className="dot-ZT"></i></span>中转订单下单只能使用中转地址，请确保供应商使用抖音电子面单进行打印发货，<span style={{ color: "red" }}>否则会造成买家收不到货而产生纠纷</span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "24px" }}>
          <p style={{ fontWeight: "800", marginLeft: "16px" }}>怎么解决?</p>
          <div>
            <div>
              <i className="dot-ZT"></i>更换货源为支持使用抖音电子面单进行打印发货的1688货源供应商
            </div>
          </div>
        </div>

      </div>
    return element
  }

  //(快手)中转的标签提示
  orderKsLogisticsTransit(order, tag) {
    const element =
      <div>
        <div style={{ marginTop: "24px" }}>
          <p style={{ fontWeight: "800", marginLeft: "16px" }}>什么是中转订单?</p>
          <div>
            <div>
              <i className="dot-ZT"></i>为了提升西北地区消费者的购物体验，平台推出了西北地区的订单中转服务，西北收货地址将先发往西北中转仓，再由官方中转仓发送到消费者地址
            </div>
          </div>
        </div>

        <div style={{ marginTop: "24px" }}>
          <p style={{ fontWeight: "800", marginLeft: "16px" }}>有什么影响?</p>
          <div>
            <div>
              <span><i className="dot-ZT"></i></span>中转订单不支持合并下单，仅显示中转仓地址，如需查看完整地址或是物流详情，请至店铺后台查看<a href={'https://s.kwaixiaodian.com/zone/order/detail?id=' + order.SellerOrder.PlatformOrderId} target='_blank'>订单详情</a>
            </div>
            <div>
              <span><i className="dot-ZT"></i></span>中转订单下单只能使用密文下单，请确保供应商使用快手电子面单进行打印发货，<span style={{ color: "red" }}>否则会造成买家收不到货而产生纠纷</span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "24px" }}>
          <p style={{ fontWeight: "800", marginLeft: "16px" }}>怎么解决?</p>
          <div>
            <div>
              <i className="dot-ZT"></i>更换货源为支持使用快手电子面单进行打印发货的1688货源供应商
            </div>
          </div>
        </div>

      </div>
    return element
  }

   //(快手)中转的标签提示
   orderKsShunfeng(order, tag) {
    const element =
      <div>


        <div style={{ marginTop: "24px" }}>
          <p style={{ fontWeight: "800", marginLeft: "16px" }}>有什么影响?</p>
          <div>
            <div>
              <span><i className="dot-ZT"></i></span>商家已选择本商品承诺顺丰包邮。为保障消费者体验，本商品请选择顺丰快递发货否则会产生发货违规，平台将扣除商家的保证金或货款，以10元/单的无门槛优惠券赔付给消费者。
            </div>
           
          </div>
        </div>

        <div style={{ marginTop: "24px" }}>
          <p style={{ fontWeight: "800", marginLeft: "16px" }}>怎么解决?</p>
          <div>
            <div>
              <i className="dot-ZT"></i>请确保供应商会使用顺丰快递发货后，再进行下单
            </div>
          </div>
        </div>

      </div>
    return element
  }
   //(快手)推荐顺丰包邮
  orderKsRecommonedShunfeng(order, tag) {
    const element =
      <div>


        <div style={{ marginTop: "24px" }}>
          <p style={{ fontWeight: "800", marginLeft: "16px" }}>什么是推荐使用顺丰发货</p>
          <div>
            <div>
              <span><i className="dot-ZT"></i></span>平台推荐商家针对这类订单使用顺丰发货，保障消费者的发货和物流配送体验，商家可以选择非顺丰的快递发货，不会产生发货违约
            </div>
           
          </div>
        </div>
      </div>
    return element
  }

  //拼多多 送货上门标签
  orderPddHomeDeliveryDoor(order, tag) {
    const element =
      <div>
        <div style={{ marginTop: "24px" }}>
          <p style={{ fontWeight: "800", marginLeft: "16px" }}>有什么影响?</p>
          <div>
            <div>
              <span><i className="dot-ZT"></i></span>商家应按照承诺提供送货上门服务，如商家未履行承诺，需向用户支付消费者赔付金，并将以无门槛平台优惠劵的形式发放给用户。<a   href={'https://mms.pinduoduo.com/other/rule?listId=&id=1483'} target='_blank'>查看平台规则</a>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "24px" }}>
          <p style={{ fontWeight: "800", marginLeft: "16px" }}>怎么解决?</p>
          <div>
            <div>
              <i className="dot-ZT"></i>请确保供应商发的快递会提供送货上门服务，再进行单独下单
            </div>
          </div>
        </div>

      </div>
    return element
  }

    //小红书 送货上门标签
    orderXiaoHongShuHomeDelivery(order, tag) {
      const element =
        <div>
          <div style={{ marginTop: "24px" }}>
            <p style={{ fontWeight: "800", marginLeft: "16px" }}>有什么影响?</p>
            <div>
              <div>
                <span><i className="dot-ZT"></i></span>送货上门订单需按产品规则进行发货，若未按规则发货，将赔付10元。<a   href={'https://school.xiaohongshu.com/lesson/normal/c2019bf866fd4ef6b6209fc85d834bdd?jumpFrom=ark&from=ark-login'} target='_blank'>查看平台规则</a>
              </div>
            </div>
          </div>
  
          <div style={{ marginTop: "24px" }}>
            <p style={{ fontWeight: "800", marginLeft: "16px" }}>怎么解决?</p>
            <div>
              <div>
                <i className="dot-ZT"></i>请使用密文下单，确保供应商使用小红书电子面单进行打印发货
              </div>
              <div>
                <i className="dot-ZT"></i>供应商发货使用快递:顺丰速运、京东物流，其余快递在陆续接入中
              </div>
              <div>
                <i className="dot-ZT"></i>确认符合要求后，再进行单独下单
              </div>
            </div>
          </div>
  
        </div>
      return element
    }
  //#endregion

  //拼多多直邮到家活动
  orderPddDirectMailActivity(order, tag) {
    const href='https://mms.pinduoduo.com/orders/detail?type=4399&from=list&sn='+order.SellerOrder.PlatformOrderId;
    console.log(href);
    const element =
      <div>
        <div>
          <div>
            <div>
              <span>针对该订单的运费，平台会为您补贴广告红包，具体请至拼多多商家后台<a href={href} target='_blank'>订单详情</a>页查看。</span>
            </div>
          </div>
        </div>
      </div>
    return element
  }
   //拼多多本地仓标签
   orderPddLocalDepotActivity(order, tag) {
    const element =
      <div>
        <div>
          <div>
            <div>
              <span>本地仓订单平台无需商家发货，且无订单收件地址，不支持采购下单。具体请至拼多多<a style={{color:"blue"}} href='https://mms.pinduoduo.com/' target='_blank'>商家后台</a>进行查询。</span>
            </div>
          </div>
        </div>
      </div>
    return element
  }
    //拼多多直邮到家活动
    orderWeixinPresent(order, tag) {
     
      const element =
        <div>
          <div>
            <div>
              <div>
                <span>该订单为微信礼物订单，请仔细确认后再进行下单采购</span>
              </div>
            </div>
          </div>
        </div>
      return element
    }

     //头条 自选快递标签
   orderTouTiaoChooseDelivery(order, tag) {
      var tagval=JSON.parse(tag.TagValue);
      console.log(tagval);
      const element =
        <div>
          <div style={{ marginTop: "24px" }}>
            <p style={{ fontWeight: "800", marginLeft: "16px" }}>有什么影响?</p>
            <div>
              <div>
                <span><i className="dot-ZT"></i></span>该订单为买家自选{tagval.Expresscompany}快递订单,自选快递金额{tagval.Amount}
              </div>
              <div>
                <span><i className="dot-ZT"></i></span>自选快递订单下单只能使用密文下单,请确保1688供应商使用抖音电子面单进行打印货。
              </div>
              <div>
                <span><i className="dot-ZT"></i></span>请按照消费者的诉求使用相应的快递服务商取号发货，否则发货失败。
              </div>
            </div>
          </div>
  
          <div style={{ marginTop: "24px" }}>
            <p style={{ fontWeight: "800", marginLeft: "16px" }}>怎么解决?</p>
            <div>
            <div>
                <i className="dot-ZT"></i>更换货源为支持使用抖音电子面单的1688货源供应商,并且确保供应商使用买家自选的{tagval.Expresscompany}快递进行发货
              </div>
            </div>
          </div>
  
        </div>
      return element
    }
//#endregion

  //#region 更换货源规格
  //更换货源弹窗
  showChangeProductV2 = async (buyerOrderItem, sellerOrder) => {
    const sellerOrderItemCode = buyerOrderItem.OrderItemCodeBySales;
    const sellerOrderItem = sellerOrder.OrderItems.find(x => x.OrderItemCode == sellerOrderItemCode)
    if (!sellerOrderItem) return;
    console.log('sellerOrderItem =>', sellerOrderItem)
    console.log('buyerOrderItem =>', buyerOrderItem)
    buyerOrderItem.ProductId = buyerOrderItem.ProductID
    this.setState({
      isChangeProductsModule: true,
      selectProductId: sellerOrderItem.ProductID,
      selectProductSkuId: sellerOrderItem.SkuID,
      selectedShopProductImgSrc: sellerOrderItem.ProductImgUrl,
      changeSearchNavsType: 0,//链接搜
      isTempRelevanceProduct: 1,
      tempSellerOrderItem: sellerOrderItem,
      changeSupplierProduct: buyerOrderItem,
      skuMappingsModuleRelationData: null,
    })
  }
  //更换货源保存
  saveSureChangeProduct = (item) => {
    console.log('saveSureChangeProduct =>', item);

    item.SourcePlatform = item.SourcePlatform ? item.SourcePlatform : 'AlibabaZhuKe';
    item.Skus = item.Skus || [];
    for (let sku of item.Skus) {
      sku.lable = sku.Color + sku.Size
      sku.SourcePlatform = item.SourcePlatform
    }
    this.setState({
      isChangeProductsModule: false,
    })
  }
  //#endregion
  //#region 单选规格弹窗
  //单选规格弹窗
  showEditSkuMapping = async (buyerOrderItem, sellerOrder) => {
    const sellerOrderItemCode = buyerOrderItem.OrderItemCodeBySales;
    const sellerOrderItem = sellerOrder.OrderItems.find(x => x.OrderItemCode == sellerOrderItemCode)
    if (!sellerOrderItem) return

    let supplierProduct = buyerOrderItem.SupplierProduct;
    if (!buyerOrderItem.SupplierProduct) {
      const data = { SupplierProductId: buyerOrderItem.ProductID, SourcePlatform: buyerOrderItem.SourcePlatform }
      this.setState({ isLoading: true })
      const res = await productRequest.LoadSupplierProduct(data)
      this.setState({ isLoading: false })
      if (!res.Success) {
        app.MessageShow('error', res.Message)
        return
      }
      supplierProduct = res.Data.AlibabaProduct
      buyerOrderItem.SupplierProduct = supplierProduct
    }

    this.setState({
      singleCheckSkuModuleDailog: true,
      singleCheckSkuData: { buyerOrderItem, sellerOrderItem },
      singleCheckSkuSelectSupplierProduct: supplierProduct,
    })
  }
  //单选规格弹窗仅订单、所有订单提示
  saveEditSkuMappingConfirm = (singleCheckSku) => {
    const singleCheckSkuData = this.state.singleCheckSkuData;
    const buyerOrderItem = singleCheckSkuData.buyerOrderItem;
    const sellerOrderItem = singleCheckSkuData.sellerOrderItem;

    if (singleCheckSku.SupplierProductId == buyerOrderItem.SupplierProduct)
      console.log('sellerOrderItem =>', sellerOrderItem)
    console.log('buyerOrderItem =>', buyerOrderItem)
    const data = {};
    data.OrderCode = sellerOrderItem.OrderCode;
    data.OrderItemCode = sellerOrderItem.OrderItemCode;
    data.PlatformOrderId = sellerOrderItem.PlatformOrderId;
    data.SubItemId = sellerOrderItem.SubItemID;
    data.PreviewCode = buyerOrderItem.PreviewCode;
    data.ShopId = sellerOrderItem.ShopId;
    data.SupplierProductId = buyerOrderItem.ProductID;
    data.SourcePlatform = buyerOrderItem.SourcePlatform;
    data.SupplierProductSkuId = buyerOrderItem.SkuID;
    data.SupplierProductSkuCode = buyerOrderItem.SkuCode;
    data.PlatformType = sellerOrderItem.PlatformType;
    data.Relations = [
      {
        ProductId: sellerOrderItem.ProductID,
        SupplierProductId: singleCheckSku.ProductId,
        SourcePlatform: singleCheckSku.SourcePlatform,
        SkuMappings: [{
          SkuId: sellerOrderItem.SkuID,
          SupplierSkuId: singleCheckSku.SkuId,
          MappingCount: singleCheckSku.mappingCount,
        }],
      }
    ];
    this.state.tempSkuMappingData = data;
    // this.state.isOnlyOrderDialog = true;
    // this.setState({}, () => {
    //   $('input[name=only_order][value=1]').prop('checked', true);
    // })
    this.saveEditSkuMapping();
  }
  //单选规格弹窗保存
  saveEditSkuMapping = async () => {
    const isOnlyOrder = $('input[name=only_order]:checked').val()
    const tempSkuMapping = this.state.tempSkuMappingData;
    tempSkuMapping.RelateDistributor = "1";
    // tempSkuMapping.RelateDistributor = isOnlyOrder;
    this.state.isOnlyOrderDialog = false;
    this.setState({ isLoading: true });
    const res = await purchaseOrderRequest.RelateTemporaryProductV2(tempSkuMapping);
    this.setState({ isLoading: false });

    if (!res.Success) {
      app.MessageShow('error', res.Message);
      return;
    }

    app.MessageShow('success', '保存成功')
    this.state.singleCheckSkuModuleDailog = false;
    console.log('tempSkuMapping =>', tempSkuMapping)
    this.setState({});
    this.loadList();
  }
  //单选规格弹窗关闭
  closeEditSkuMapping = () => {
    this.setState({
      singleCheckSkuModuleDailog: false,
    })
  }
  //#endregion 
  //#region 去匹配、更换货源规格相关
  //弹窗关闭
  closeSkuMappingsModule = () => {
    this.setState({
      skuMappingsModuleDailog: false,
      skuMappingSelectProduct: null,
    })
  }
  //去匹配、更换规格展示规格映射弹窗
  showSkuMapping = (product, showAddSupplierProduct) => {
    this.setState({
      skuMappingsModuleDailog: true,
      skuMappingSelectProduct: product,
      skuMappingShowAddSupplierProduct: showAddSupplierProduct,
      skuMappingsModuleRelationData: null,
    })
  }
  //去匹配、更换规格展示规格映射弹窗保存
  skuMappingSaveSure = (relations) => {
    const selectOrderItem = this.state.skuMappingSelectProduct
    const skuId = selectOrderItem.SkuID
    const productId = selectOrderItem.ProductID

    const data = {}
    data.TargetShopId = selectOrderItem.ShopId
    data.ShopId = selectOrderItem.ShopId
    data.OrderCode = selectOrderItem.OrderCode
    data.Relations = []
    data.TargetShopPt = selectOrderItem.PlatformType
    for (const relation of relations.Relations) {
      // const mappings = relation.SkuMappings.filter(x => x.SkuId == skuId)
      // if(mappings.length == 0)
      //   continue;
      const mappings = relation.SkuMappings;
      data.Relations.push({
        ProductId: productId,
        SupplierProductId: relation.SupplierProductId,
        SourcePlatform: relation.SourcePlatform,
        SkuMappings: mappings,
      })
    }
    if (data.Relations.length == 0) {
      app.MessageShow('error', '请选择规格！')
      return
    }
    this.saveOrderSkuMapping(data)
  }
  //去匹配、更换规格展示规格映射弹窗保存
  saveOrderSkuMapping = async (data) => {
    this.setState({ isLoading: true })
    const res = await batchDistributionRequest.RelateProductV2(data)
    this.setState({ isLoading: false })

    if (res.Success == true) {
      this.setState({ isLoading: true });
      this.closeSkuMappingsModule()
      this.loadList();
      app.MessageShow('success', '保存成功！');
    } else {
      app.MessageShow('error', res.Message);
    }
  }
  //更换货源规格点击添加货源
  skuMappingShowAddSupplierProduct = (data) => {
    const item = data.ProductFx;
    this.setState({
      isChangeProductsModule: true,
      selectProductId: item.PlatformId,
      selectedShopProductImgSrc: item.ImageUrl,
      isTempRelevanceProduct: 0,
      skuMappingsModuleRelationData: data,
      isReturnSelectSupplierProduct: 1,
    })
  }
  //#endregion



  //#region  发货失败导出
    //导出发货失败的订单
  exportSendErrorOrder = (e) => {
    var shopId = this.state.newSelectShopId;
    if (shopId == undefined || shopId == "") {
      app.MessageShow("warning", '请选择店铺！', 1500);
      return;
    }
    this.setState({ isShowModalByExportSelet: true }, () => {
      $("input[name='exportSeletName']:eq(0)").attr("checked", 'checked');
    });
  }


  //导出，按类型来导出
  exportSendErrorOrderByType = () => {
    var shopId = this.state.newSelectShopId;
    var types = $("input[name='exportSeletName']:checked").val();
    
      this.setState({ isLoading: true, loadingTitle: "导出中...", isShowModalByExportSelet: false });
      var that = this;
       var taskSendErrorPost = { taskCode: "", errRes: "" ,types:types};
        //任务式
        app.requests({
        url: "/PurchaseOrder/GetSendErrorOrderExcelTask",
        data: { ShopId: shopId },
        success: function (res) {
          //关闭动画
          if (res.RequestError == true)//请求失效了。isLoading关闭看需求写
          {
              that.setState({ isLoading: false}); //关闭动画
              return;
          }
          if (res.Success) {
              taskSendErrorPost.taskCode = res.Data;
              that.setState({ taskSendErrorPost: taskSendErrorPost });
              setTimeout(() => {
                  that.exportSendErrorOrderByTask();
              }, 1000);
          } else
              app.MessageShow('error', "导出错误：" + res.Message, 3000);    
        },
      });
    
  }

  //任务式导出（拼多多发货失败的导出）
  exportSendErrorOrderByTask=()=>{
    var taskSendErrorPost = this.state.taskSendErrorPost;
    var types=taskSendErrorPost.types;
    var that = this;
    app.requests({
        url: "/Common/GetZhuKeReqTask",
        data: { TaskCode: taskSendErrorPost.taskCode },
        success: function (res) {
            if (res.RequestError == true)//请求失效了。isLoading关闭看需求写
            {
                that.setState({ isLoading: false, hasLoadBorder: false });
                return;
            }

            if (res.Success) {
                var dates = res.Data;

                if (dates.FinishedTime != null && dates.FinishedTime != "" && dates.FinishedTime != undefined) {
                    that.setState({ isLoading: false, taskSendErrorPost:{ taskCode: "", errRes: "" ,types:""}});

                    if (dates.Status == "Error" && dates.ErrorMsg != null && dates.ErrorMsg != undefined && dates.ErrorMsg != "")
                        app.MessageShow('error', "导出失败:" + dates.ErrorMsg, 3000);
                    else if (dates.Status == "Error" && dates.RspContent == null)
                        app.MessageShow('error', "导出失败，原因:RspConten is null", 3000);
                    else {
                      var listData = JSON.parse(dates.RspContent);
                      if(listData ==null || listData ==undefined)
                          listData=[];

                      if (listData.length == 0)
                        app.MessageShow('notice', "没有查询到可导出的数据！", 2000);
                      else{
                        if (types == "csv") {
                          that.exprortExcelBySendErrorAndCsv(listData);
                        }else{  //Excel导出
                          that.exprortExcelBySendErrorAndExcel(listData);
                        }
                      }
                    }
                } else {
                    //任务未执行完，继续轮训
                    setTimeout(() => {
                        that.exportSendErrorOrderByTask();
                    }, 1000);
                }

            } else {
                app.MessageShow('error', "错误信息：" + res.Message);

                that.setState({ isLoading: false, hasLoadBorder: false, sureUnBindShopPost: { taskCode: "", errRes: "" } });
            }
        },
    });


  }


  //csv格式
  exprortExcelBySendErrorAndCsv = (jsonData) => {
    //直接导出
    let str = `订单号,快递公司（必填）,快递单号,1、单次批量发货请勿超出5000条记录，如超出5000条，请拆分文件后分别上传\n`;
    str += `order_sn,shipping_name,shipping_sn,2、请不要删除第二行，否则会造成发货上传失败\n`;
    //增加\t为了不让表格显示科学计数法或者其他格式
    for (let i = 0; i < jsonData.length; i++) {
      for (let item in jsonData[i]) {
        str += `${jsonData[i][item] + '\t'},`;
      }
      str += '\n';
    }
    //encodeURIComponent解决中文乱码
    let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
    //var uri = "data:text/csv;charset=utf-8,\uFEFF" + encodeURI(str);

    //通过创建a标签实现
    var link = document.createElement("a");
    link.href = uri;
    //对下载的文件命名
    link.download = "发货失败的销售单.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  //Excel格式
  exprortExcelBySendErrorAndExcel=(listData)=>{

    const workbook = new Workbook;
    const sheet = workbook.addWorksheet('Sheet1', { properties: { defaultRowHeight: 23 } });
    sheet.pageSetup.horizontalCentered = true;
    sheet.pageSetup.verticalCentered = true;
    sheet.columns = [  //表头
      { header: '订单号', key: 'title1', width: 30, style: { alignment: { vertical: 'middle', horizontal: 'center' } } },
      { header: '快递公司（必填）', key: 'title2', width: 22, style: { alignment: { vertical: 'middle', horizontal: 'center' } } },
      { header: '快递单号', key: 'title3', width: 30, style: { alignment: { vertical: 'middle', horizontal: 'center' } } },
      { header: '1、单次批量发货请勿超出5000条记录，如超出5000条，请拆分文件后分别上传', key: 'title4', width: 90, style: { alignment: { vertical: 'middle', horizontal: 'left',tabColor:"#ff0000" } ,font:{color:	{ argb: 'ff511c'}} } },
    ];
    sheet.addRow({
      title1: "order_sn",
      title2:"shipping_name",
      title3: "shipping_sn",
      title4:"2、请不要删除第二行，否则会造成发货上传失败"
    });
    listData.forEach((item,index)=>{
      sheet.addRow({
        title1: item.order_sn,
        title2: item.shipping_name,
        title3: item.shipping_sn,
      });

    })
    workbook.xlsx.writeBuffer().then((buffer) => {
      undefined
      writeFile('发货失败的销售单Excel表格.xlsx', buffer);
    });
    const writeFile = (fileName, content) => {
      undefined
      let a = document.createElement("a");
      let blob = new Blob([content], { type: "text/plain" });
      a.download = fileName;
      a.href = URL.createObjectURL(blob);
      a.click();
    };

  }

  onchangeShopCheck=(obj)=>{
    let id=obj.Id;
    this.setState({
      newSelectShopId:id
      ,selectShopPlatformType:obj.PlatformType
      ,newSelectShopName:obj.ShopName
    },()=>{
      this.selectShopFun(id); 
    });
    

  }

  //#endregion



  //#region 重新发货 
  //查看发货错误情况
  onlineSendErrorMsg = (platformOrderId, orderItemCode) => {

    var data = {
      ShopId: this.state.newSelectShopId,
      SalesOrderCode: platformOrderId,
      SalesOrderItemCode: orderItemCode
    };
    var that = this;
    that.setState({ isLoading: true });
    app.requests({
      url: "/PurchaseOrder/GetOnlineSendErrorMsg",
      data: data,
      success: function (res) {
        that.setState({ isLoading: false });
        if (res.RequestError == true)//请求失效了。isLoading关闭看需求写
          return;


        if (res.Success) {
          var message = res.Data.ErrorMessage
          Dialog.show({
            title: "发货失败原因",
            content: message,
            footer: false
          });
        } else {
          that.setState({ isLoading: false });
          app.MessageShow('error', "查看原因报错：" + res.Message);
        }
      },
    });

  }
  //重新发货
  reOnlineSend = (salesOrderCode,platformOrderId, purchaseOrderCode, buyerPlatformOrderId) => {
    var data = {
      SalesOrderCode: salesOrderCode,
      PurchaseOrderCode: purchaseOrderCode,
      PurchaseOrderId: buyerPlatformOrderId,
      ShopId: this.state.newSelectShopId
    }

    var orderList = this.state.orderList.map(x => x.BuyerOrders).flat().filter(x => x && x.BuyerOrder && x.BuyerOrder.OrderTags) ;
    const item = orderList.find(x => x.BuyerOrder.OrderCode == purchaseOrderCode);
    if(item){
      let changeAddressTag = item.BuyerOrder.OrderTags.find(x => x.Tag == 'OrderAddressUpdate'  || x.Tag == 'OrderReceiverUpdate');
      if(changeAddressTag)
      {
        this.setState({ allOrderSendChangeAddressDialog:true})
        return;
      }
    }

    this.setState({ isLoading: true, loadingTitle: '重新发货...',detailsPlatformOrderId:platformOrderId});
    var that = this;
    app.requests({
      url: "/PurchaseOrder/ReOnlineSend",
      data: data,
      success: function (res) {
        //关闭动画
        that.setState({ isLoading: false });
        if (res.RequestError == true)//请求失效了。isLoading关闭看需求写
          return;

        if (res.Success) {
          app.MessageShow("success", "重新发货成功。", 2100);
          
          that.syncOneOrder("seller", "reOnlineSendButton");//同步并查询一次
        } else
          app.MessageShow('error', "错误信息：" + res.Message);
      },
    });

  }
  reOnlineSendTask = (confirm)=>{
    var orderList = this.state.orderList;
    var shopId = this.state.newSelectShopId;
    var selectShopPlatformType = this.state.selectShopPlatformType;

    var selectOrderList = this.state.selectOrderList;
    if(selectOrderList.length > 0)
    {
      var tempOrderList = this.state.orderList.map(x => x.SellerOrder).filter(x => x.OrderTags);

      let findChangeAddressOrders = [];
      for (let index = 0; index < selectOrderList.length; index++) {
        const orderCode = selectOrderList[index];
        const item = tempOrderList.find(x => x.OrderCode == orderCode);
        if(!item) continue;
        
        let changeAddressTag = item.OrderTags.find(x => x.Tag == 'OrderAddressUpdate' || x.Tag == 'OrderReceiverUpdate');
        if(changeAddressTag)
          findChangeAddressOrders.push(orderCode);
      }

      if(findChangeAddressOrders.length > 0 && findChangeAddressOrders.length == selectOrderList.length && !confirm)
      {
        this.setState({ allOrderSendChangeAddressDialog:true})
        return;
      }
      else if(findChangeAddressOrders.length > 0 && !confirm)
      {
        this.setState({ orderSendChangeAddressDialog:true})
        return;
      }
      selectOrderList = selectOrderList.filter(x => !findChangeAddressOrders.includes(x))
    }

    //若未选择订单，择提示【请选择订单】
    if(selectOrderList.length == 0){
      app.MessageShow("notice", "请先选择自动发货失败订单!")
      return;
    }

    /**
     * 组装采购单、平台单数据
     */
     let purchaseOrderIds = [];
     let salesOrderCodes = [];
     
     selectOrderList.forEach(purchaseOrderId =>{
      let order = orderList.find(o => o.SellerOrder.OrderCode == purchaseOrderId);
      if(order)
      {
        salesOrderCodes.push(order.SellerOrder.OrderCode);//平台单
        if(order.BuyerOrders && order.BuyerOrders.length > 0)
        {
          for (let index = 0; index < order.BuyerOrders.length; index++) {
            const ele= order.BuyerOrders[index];
            if(ele.BuyerOrder.PlatformOrderId)
              purchaseOrderIds.push(ele.BuyerOrder.PlatformOrderId);
          }
        } 
      }
     })
     let apiData = {
      SalesOrderCode:salesOrderCodes,
      PurchaseOrderIds:purchaseOrderIds,
      ShopId:shopId,
      PlatformType:selectShopPlatformType
     }

     //提示加载项 【重新发货中...】
    this.setState({ isLoading: true, loadingTitle: '重新发货中...'})
    const that = this;
    
    setTimeout(() =>{
      const url = '/PurchaseOrder/ReOnlineSendTask';
      app.requests({
        url:url,
        data:apiData,
        success:(res) => { 
          if (res.RequestError == true)//请求失效了。isLoading关闭看需求写
          {
            that.setState({ isLoading: false });
            return;
          }

          if (res.Success) {
            const taskCode = res.Data.TaskCode;
            that.reOnlineSendTaskPoll(taskCode);
          } else{
            this.setState({ isLoading: false, loadingTitle: '重新发货中...'})
            app.MessageShow('error', "错误信息：" + res.Message);
          }}
      });
    },0)
  }
  //轮询查询任务结果
  reOnlineSendTaskPoll(taskCode)
  {
    var that = this;
    app.requests({
      url: "/Common/GetZhuKeReqTask",
      data: { TaskCode: taskCode },
      success: function (res) {
        if (res.RequestError == true)//请求失效了。isLoading关闭看需求写
        {
          that.setState({ isLoading: false });
          return;
        }

        if (res.Success) {
          var dates = res.Data;
          if (dates.FinishedTime) 
          {
            that.setState({ isLoading: false});
            if (dates.Status == "Error" && dates.ErrorMsg)
                that.setState({isShowCommonError:true,showCommonErrorMessage:dates.ErrorMsg});//统一用弹窗
            else if (dates.Status == "Error" && dates.RspContent == null) {
              app.MessageShow('error', "任务发生了异常，失败原因:RspConten is null", 3000);
            } else {
              var rspContentJson = JSON.parse(dates.RspContent);
              let msg = rspContentJson.msg;
              app.MessageShow('success', msg, 2200);
              //that.syncOneOrder("seller", "reOnlineSendButton");//同步并查询一次
              //var shopId =  that.set;
              setTimeout(()=>{
                that.setState({ isLoading: true,orderList:[], current: 1 }, () => {
                  that.orderListCheckboxClose();
                  that.loadList();
                })
              },3000);
              
            }
          } else {
            //任务未执行完，继续轮训
            setTimeout(() => {
              that.reOnlineSendTaskPoll(taskCode);
            }, 1000);
          }
        }
      },
    });
  }
  //#endregion
  //#region 获取物流信息
  getLogisticsInfo = async (orders) => {

    if(!orders || orders.length == 0)
      return;

    const oiCodes = [];
    const queryBuyerOrder = [];
    orders.forEach(order =>{
      if(order.BuyerOrders && order.BuyerOrders.length > 0){
        queryBuyerOrder.push(...order.BuyerOrders.filter(x => x.BuyerOrder && x.BuyerOrder.PlatformOrderId))
      }
    })
    oiCodes.push(...queryBuyerOrder.map(x => x.BuyerOrder.OrderCode))
    if(oiCodes.length == 0)
      return;
    
    const data = {
      OrderCode : oiCodes
    }
    
    const res = await purchaseOrderRequest.GetBuyerOrderLogisticsInfo(data);
    if(res.Success)
    {
      const logisticsInfos = (res.Data && res.Data.List) || [];
      queryBuyerOrder.forEach(order =>{
        const logiticsInfo = logisticsInfos.find(x => x.OrderCode == order.BuyerOrder.OrderCode);
        if(logiticsInfo != null){
          order.LogisticsInfo = logiticsInfo.LogisticsInfo;
        }
      })
      this.setState({})
    }
  }
  //#endregion
  tohuoyuanLink = (orderItem,order)=>{
    if(orderItem.IsMapping == false && !order.BuyerOrder.PlatformOrderId){
      return;
    }
    if(orderItem.SourcePlatform == 'TaoteZhuKe'){
      return;
    }
    app.huoyuanLink({ProductId:orderItem.ProductID});
  }

  //#region  同步相关
    //加载Tig
    initializeTig() {
      var orderTig = localStorage.getItem("orderSyncTigBox") || null;
      if (orderTig == null) {
        this.setState({ isTip: true });
      }
    }
    closeTig() {
      localStorage.setItem("orderSyncTigBox", 1);
      this.setState({ isTip: false });
    }

    async syncAliBabaOrder(dayid) {
      var shopByLists = [];
      shopByLists.push(this.state.newSelectShopId);
      const day = $("#" + dayid).val();
      var data = {
        SyncSids: shopByLists,
        Source: 1,
        SyncOrderType: 1,
        TimeParagraph: day
      }
      this.setState({ sysncAlibabaOrderStatusTaskProgress: 0 });
      this.setState({ isLoading: true });
      const res = await triggerSync(data);
      this.setState({ isSyncOrderModal: false });
      this.setState({ isLoading: false });
      if (res.RequestError == true)//请求失效了。isLoading关闭看需求写
      {
        this.setState({ sysncOrderStatusTaskProgress: 0 });
        return;
      }
  
      if (res.Success) {
        app.MessageShow('success', "已提交后台执行，请在同步完成后再刷新页面查看数据！");
        this.syncAlibabaOrderByStatus();
      } else {
        app.MessageShow('error', "同步错误：" + res.Message);
        this.setState({ sysncAlibabaOrderStatusTaskProgress: 0 });
      }
    }
    async syncOrderByIds(type, id) {
      const shopId = this.state.newSelectShopId;
      const orderCode = $("#" + id).val();
      if (orderCode == null || orderCode == undefined || orderCode == "") {
        app.MessageShow("error", "请输入订单号");
        return;
      }
      var data = {
        PlatformOrderIds: orderCode,
        ShopId: type == 2 ? 0 : shopId
      }
      var that = this;
      this.setState({ isLoading: true });
      app.requests({
        url: "/Order/ManualSyncSingleOrder",
        data: data,
        success: function (res) {
          that.setState({ isSyncOrderModal: false });
          that.setState({ isLoading: false });
          if (res.RequestError == true)//请求失效了。isLoading关闭看需求写
          {
            return;
          }
          if (res.Success) {
            app.MessageShow('success', '同步完成');
            that.loadList();
          } else {
            app.MessageShow('error', "同步错误：" + res.Message);
          }
        },
      });
  
    }

      //开启同步弹窗
  async openSyncOrderShowModel() {
   
    if(this.state.isShowSyncOrderShopCdt)
    {
       //this.calShopCountDownCount(this.state.syncOrderShopCdtTime);
       this.calShopCountDownCountBysyncCountDown();       
    }
    
    this.syncAlibabaOrderByStatus();
    this.setState({
      isSyncOrderModal: true
    });
  }
  changeSyncOrderNav = (e) => {
    this.setState({
      syncOrderActiveId: e.id
    })
  }
  //计时器完成触发
  async countDownTimerComplete(type) {
    if (type == 0) {
      this.setState({
        isShowSyncOrderShopCdt: false
      })
    }
    else {
      this.setState({
        isShowSyncOrderShopAlibabaCdt: false
      })
    }
  }
  //计时器完成触发
  async countDownTimerSyncCount(count) {
    this.setState({
      syncShopCheckTime: count
    })
  }
  //同步1688
  async syncAlibabaOrderByStatus() {
    var that = this;
    app.requests({
      url: "/Order/GetSingleHuoYuanSyncStatus",
      success: function (res) {
        if (res.RequestError == true)//请求失效了。isLoading关闭看需求写
        {
          that.setState({ isSyncLoading: false });
          that.setState({ sysncAlibabaOrderStatusTaskProgress: 100 });
          return;
        }

        if (res.Success) {
          if (res.Data.Percent == 100) {
            const lastSyncTime = res.Data.LastSyncTime;
            if (lastSyncTime != null && lastSyncTime != "" && lastSyncTime != undefined) {
              const dueTime = new Date(lastSyncTime);
              dueTime.setMinutes(dueTime.getMinutes() + 10);
              const currentTime = new Date();
              if (currentTime < dueTime) {
                // 计算两个时间的毫秒时间戳差
                var diff = dueTime.getTime() - currentTime.getTime();
                // 将毫秒差转换为秒
                var seconds = diff / 1000;
                seconds = Math.ceil(seconds);
                that.setState({ isShowSyncOrderShopAlibabaCdt: true, syncOrderShopAlibabaCdtSeconds:seconds });
              }
            }
            that.setState({ sysncAlibabaOrderStatusTaskProgress: res.Data.Percent });

          } else {
            that.setState({ sysncAlibabaOrderStatusTaskProgress: res.Data.Percent });

            setTimeout(() => {
              that.syncAlibabaOrderByStatus();
            }, 1000);
          }
        } else {
          that.setState({ sysncAlibabaOrderStatusTaskProgress: 100 });
        }

      },
    });

  }

    //通过时间计算描述
    calShopCountDownCount(data) {
  
      const currentTime = new Date().getTime();
      if (currentTime < data) {
        // 计算两个时间的毫秒时间戳差
        var diff = data - currentTime;
        // 将毫秒差转换为秒
        var seconds = diff / 1000;
        seconds = Math.ceil(seconds);
        console.log(seconds);
        this.setState({ syncOrderShopCdtSeconds: seconds});
      }
   
     
    
  }
  //通过获取html拿到秒数计算时间
  calShopCountDownCountBysyncCountDown()
  {
    var value= $("#syncCountDown").html();
    var valueArray= value.split('S');
    var seconds=valueArray[0];
    this.setState({ syncOrderShopCdtSeconds: seconds});
  }

  //#endregion

  render() {
    const { shopList } = this.state;
    let selectSourcePlatform = this.state.sourcePlatformList.find(x => x.active == true);
    
    return (
      <div className="orderListWarp">
        <div className="zk-maiwrap">
          <div className="zk-search">
            <div className="zk-search-wrap" style={{ display: "flex", flexWrap: "wrap" }}>

              <label>
                <SelectShoPBox
                    width={'160'}
                    height={'32'}
                    selectData={this.state.shopList}
                    selectTitle={'请选择店铺'}
                    onchangecheck={(selectItem) => this.onchangeShopCheck(selectItem) }
                  >
                  </SelectShoPBox>
              </label>


              {/* <label>
                <select id="orderListSelectShopId" onChange={(e) => this.selectShopFun(e)}>
                  <option value="">请选择店铺</option>
                  {
                    shopList.map((item) =>
                      item.IsSelected == true ?
                        <option value={item.Id} platformType={item.PlatformType} selected>{item.ShopName}</option>
                        : <option value={item.Id} platformType={item.PlatformType}>{item.ShopName}</option>
                    )
                  }
                </select>
              </label> */}
              <div className="selectTime">
                <select id="selectChooseDateId" >
                  <option value="7">7天</option>
                  <option value="15">15天</option>
                  <option value="30" selected >30天</option>
                  <option value="60">60天</option>
                  <option value="90">90天</option>
                </select>
              </div>
              <div className="selectTime" style={{ marginLeft: "15px" }}>
                <select id="orderBySortId" >
                  <option value="asc">最新订单在后</option>
                  <option value="desc">最新订单在前</option>
                </select>
              </div>
              <label style={{ marginLeft: "15px" }}>
                <select id="OrderType" style={{width: '100px'}} >
                  <option value="0">平台订单编号</option>
                  <option value="1">采购订单编号</option>
                </select>
                <input style={{ marginTop: 0 }} type="text" id="orderListInputOrderId" onChange={this.orderInputOnClick} placeholder="多个平台订单编号(，)分隔" />
              </label>
              <div className="selectTime" style={{ marginRight: "15px" }}>
                <select id="PurchaseOrderType" >
                  <option value="">全部订单类型</option>
                  <option value="1">线上代发订单</option>
                  <option value="2">私域代发订单</option>
                </select>
              </div>
              <label style={{ marginLeft: "3px" }}>
                <input style={{ marginTop: 0 }} type="text" id="supplierWangWangInputId" placeholder="供应商旺旺" />
              </label>
              <label style={{ marginLeft: "3px" }}>
                <select id="orderProductByTypeId" style={{ width: "80px" }} >
                  <option value="ProductID">商品ID</option>
                  <option value="ProductSubject">商品标题</option>
                </select>
                <input style={{ marginLeft: "5px", marginTop: 0 }} type="text" id="orderProductByTypeInputeId" placeholder="输入值" />
              </label>
              <span className="norDefBtn" id='queryOrderButton' onClick={() => { this.search() }} >查询</span>
            </div>
          </div>
        </div>
        <div className="zk-maiwrap" style={{ paddingBottom: "80px", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>

          <div className="NavChangeAndSyncOrderBtn">
            <TableNavChange distributionStatus={this.state.orderStatus} changeNav={(item) => { this.changeNav(item) }} />
            <div className="progress-wrap">
             {
                this.state.isTip ?
                  <div className='tip-box'>
                    若您发现软件订单数据与店铺后台不一致，请及时同步订单以保证订单一致性。
                    <i className='iconfont icon-chuyidong' onClick={() => this.closeTig()}></i>
                  </div>
                  : null
              }
              <Progress
                percent={this.state.sysncOrderStatusTaskProgress}
                progressive
                shape="circle"
                size="large"
              />
             {
                this.state.sysncOrderStatusTaskProgress == 100 || this.state.sysncOrderStatusTaskProgress == "100" ?
                  this.state.isShowSyncOrderShopCdt == false ? <span className="syncOrderBtn-span" onClick={() => this.openSyncOrderShowModel()}>同步订单</span> : <span id="syncCountDown" className="syncOrderBtn-span" onClick={() => this.openSyncOrderShowModel()} style={{ backgroundColor: "#ccc", border: '1px solid #ccc' }} ><CountdownTimerBySecond isEnable={this.state.isShowSyncOrderShopCdt} data={this.state.syncOrderShopCdtSeconds} onSyncCount={(e) => this.countDownTimerSyncCount(e)} onComplete={() => this.countDownTimerComplete(0)} /></span>
                  : <span style={{ color: "#999" }}>正在同步中...</span>

              }

              <span className="warnColor" style={{ marginLeft: "10px" }}>上次同步时间:{this.state.lastSyncTimeByShop}</span>
            </div>
          </div>
          {/* 交易关闭的状态下，显示 */}
          <div className='searchWarn' id="searchWarn" style={{ height: "15px",  marginBottom: "10px"}}>
            <span>店铺订单已退款但采购单：</span>
            <span onClick={(e) => this.searchTradingclose(e, "noRefund")} className={this.state.refundType == "noRefund" ? "searchBtn active" : "searchBtn"}>未申请退款</span>
            <span onClick={(e) => this.searchTradingclose(e, "refund")} className={this.state.refundType == "refund" ? "searchBtn active" : "searchBtn"}>退款中</span>

            <span className='defColor hover'>友情提示
              <ul className='searchWarn-title'>
                <li>1. 此功能针对开通极速退款的商家。</li>
                <li>2. 厂家还未发货，但买家申请退款，店铺已完成极速退款；商家需及时申请采购单退款。</li>
                <li>3. 未申请退款状态：店铺订单已完成退款，采购单已付款且未申请退款。</li>
                <li>4. 退款中状态：店铺订单完成退款，采购单已付款且属于退款中状态。</li>
              </ul>
            </span>
          </div>

          <div className='operate-wrap' style={{ justifyContent: 'flex-start' }}>

            <div className='SourcePlatformNav' id='SourcePlatformNav'>

              {
                this.state.orderStatusIndex == 0 ?
                  <ul className='SourcePlatformNavWrap'>
                    {
                      this.state.purchaseOrderStatusList.map(ele => {
                        if(ele.title == "全部")
                              return null;
                        return <li className={ele.active ? "active SourcePlatformNavWrap-item" : "SourcePlatformNavWrap-item"} key={ele.id} onClick={() => { this.changePurchaseOrderStatus(ele) }}>
                          <span>
                            {ele.title}
                            {ele.number != -1 ? <span style={{ color: "#77bf04" }}>({ele.number})</span> : null}
                          </span>
                          
                        </li>
                      })
                    }
                  </ul> : null
              }
            </div>

          
            <div className='operate-left' id='waitingSendExportId'>
              <label>
                <input type="checkbox" value="sendOverdue"
                  id="sendOverdue_checkboxId" onClick={(e) => this.clickOrderSubStatus('sendOverdue', e.currentTarget.checked)}
                  name="checkboxNameByOrderStatus" />
                <span>已逾期发货</span>
              </label>
              <label>
                <input type="checkbox" value="twelveDelivery"
                  id="twelveDelivery_checkboxId" onClick={(e) => this.clickOrderSubStatus('twelveDelivery', e.currentTarget.checked)}
                  name="checkboxNameByOrderStatus" />
                <span>12小时内需发货</span>
              </label>
              <label id="sendErrorByLeftId" >
                  <input type="checkbox" value="autoSendError"
                    id="autoSendError_checkboxId"
                    name="checkboxNameByOrderStatus"
                    onClick={() => this.substateByCheckbox('autoSendError')} />
                  <span>自动发货失败</span>
                </label>
              <div className='waitingSendExportWrap' style={{ height: "15px" }} id="exportByRightId">
                <div onClick={(e) => this.exportSendErrorOrder(e)} className={"operateBtn"}>
                  <span className="iconfont icon-xiazai"></span>
                  <span className="operateBtn-title">导出发货失败订单</span>
                </div>
                <span className='defColor hover'>友情提示
                  <ul className='waitingSendExport-title'>
                    <li>1. 拼多多店铺订单进行发货时，官方会检测<span style={{ color: "red" }}>是否使用了拼多多电子面单</span>获取快递单号</li>
                    <li>
                      2. 如果未使用拼多多电子面单获取单号，则会<span style={{ color: "red" }}>有几率发货失败</span>。对发货失败的订单，系统会自动重试20次。如20次还未成功，则不会自动发货，需要用户手动到拼多多店铺后台发货。
                    </li>
                    <li>
                      3. 通过工具向1688下采购单时，会<span style={{ color: "red" }}>自动备注</span>
                      【请使用拼多多电子面单发货】。但厂家是1688商家，大部分使用的是菜鸟电子面单，有条件的用户，可与厂家沟通要求使用拼多多电子面单。
                    </li>
                    <li>
                      4. 如有订单发货失败，可直接<span style={{ color: "red" }}>导出</span>发货失败订单及对应快递单号，到拼多多<span style={{ color: "red" }}>店铺后台</span>
                      使用<span style={{ color: "red" }}>表格批量导入发货</span>(<span style={{ color: "red" }}>请勿修改表格内容</span>)
                    </li>
                  </ul>
                </span>
              </div>
              
            </div>
            

            <div className='operate-right' id='decryptOprateId'>
              <label>                
                <span>下单提示 解密额度不足? <span style={{ color: "#5584ff" }} onClick={()=>{  this.setState({ noEncryptLinkDialog: true })}}>去申请提额</span>  <span style={{ color: "#5584ff" }} onClick={() => { hashHistory.push("/supplierMarke") }}>去设置密文下单</span></span>
              </label>
           </div>
            

          </div>

          <table class="table-style01 orderList" id="orderList_table">
            <thead>
              <tr style={{backgroundColor:"#f5f5f5"}}>
                <th colspan="20" style={{ padding: "8px 0" }}>
                  <div className='tableWrap-header'>
                    <label style={{ width: "80px",textAlign: 'left',paddingLeft:'5px'}}>
                      <input type="checkbox" id="allCheck_id_Above" onClick={() => this.allCheckbox("above")} />
                      <i>全选本页</i>
                    </label>
                    <div className='tableWrap-header-right'>
                      <div className='tableWrap-header-right-title' style={{ width: '320px' }}>平台订单信息</div>
                      <div className='tableWrap-header-right-ul'>
                        {
                          this.state.orderStatusIndex == 0 ?
                            <ul className='SourcePlatformNavWrapNav'>
                              {
                                this.state.sourcePlatformList.map(ele => {
                                  if(ele.isHide !=true)
                                  {
                                    return <li className={ele.active ? "active SourcePlatformNavWrap-item" : "SourcePlatformNavWrap-item"} key={ele.id} onClick={() => { this.changeSourcePlatform(ele) }}>
                                    {ele.title}
                                    {/* {ele.title != "全部" ? <span style={{ color: "#77bf04" }}>({ele.number})</span> : null} */}
                                    </li>
                                  }
                                })
                              }
                            </ul> : null
                        }

                      </div>
                      <div className='tableWrap-header-right-title' style={{ textAlign: 'left' }}>采购订单信息</div>
                    </div>
                  </div>
                </th>


                {/* <th style={{ width: "30px" }}><input type="checkbox" id="allCheck_id_Above" onClick={() => this.allCheckbox("above")} /></th>
                <th style={{ width: "570px" }}>平台订单信息</th>
                <th style={{ width: "570px" }}>采购订单信息</th> */}

              </tr>
            </thead>
            <tbody>

              {
                this.state.orderList.length == 0 && this.state.isAuthShop != true ?
                  <tr>
                    <td className="noneData" colSpan="20">
                      <div className="noneData-wrap">
                        <i className="iconfont icon-wushuju"></i>
                        <span className="noneData-title">暂无数据！</span>
                      </div>
                    </td>
                  </tr> : null
              }
              {
                this.state.isAuthShop == true ?
                  <tr>
                    <td className="noneData" colSpan="20">
                      <div className="noneData-wrap">
                        <i className="iconfont icon-wushuju"></i>
                        <span className="noneData-title" style={{ color: "red" }}>店铺授权已失效，请前往【我的店铺】页面重新授权店铺</span>
                      </div>
                    </td>
                  </tr> : null
              }
              {
                this.state.orderList.map(item => {
                  let { SellerOrder, BuyerOrders } = item;
                  BuyerOrders = BuyerOrders || [];
                  return <tr>
                    <td>
                      <div className="inputWrap">
                        <input type="checkbox" Id={item.SellerOrder.OrderCode + "_Id"} onChange={(e) => this.orderChange(e, item.SellerOrder.OrderCode)} />
                      </div>
                    </td>
                    <td valign="top">
                      <table className="orderTables table-style02">
                        {this.sellerOrderRender(item)}
                        {
                          SellerOrder.OrderItems.map((itemSellerSkuList, index) =>
                            this.sellerOrderItemRender(item, itemSellerSkuList, index, item.SellerOrder.OrderItems.length)
                          )
                        }
                        {

                          item.SellerOrder.OrderItems.length > 2 ?
                            <tr><td colspan="2"><div><span className="moreShowBtn" onClick={(e) => this.moreShowProduct(e, item.SellerOrder.OrderItems.length)}><i className="iconfont icon-down-fill"></i><s>展开更多</s></span></div></td></tr> : null
                        }
                        {/*平台订单-- 地址信息 */}
                        <tr>
                          <td colspan="2">
                          
                            收货地址：
                            {
                              item.SellerOrder.IsSpliceGroupTag ==true &&  this.state.orderStatusIndex == 0  ?
                              <i class="mainColor" style={{ marginRight: "350px" }}>拼团中,暂未成团</i>
                              :item.SellerOrder.IsSpliceGroupTag ==true && this.state.orderStatusIndex ==3  ?
                              <i class="mainColor" style={{ marginRight: "350px" }}>拼团单,拼团失败</i>
                              :
                              <i class="mainColor">{item.SellerOrder.ToName}，{item.SellerOrder.ToMobile}，{item.SellerOrder.ToFullAddress}</i>
                            }
                           
                            
                            <div className='orderTags'  style={{"display":"inline"}}>
                            {
                              item.SellerOrder.OrderTags?
                                item.SellerOrder.OrderTags.map(tag =>{
                                  const tempTag = this.state.tagEnum[tag.Tag];
                                  if(!tempTag)
                                    return null;
                                  if(tempTag.predicate && tempTag.predicate(item,tag) == false)
                                    return null;

                                  if(!tempTag.clickContent)
                                    return <span className={tempTag.tagClass}>{tempTag.tagName}</span>
                                  return <Balloon type={'primary'} align="t"  style={tempTag.style || {"zIndex":"10000"}} closable={false} trigger={<span className={tempTag.tagClass}>{tempTag.tagName}</span> } triggerType="hover">
                                            {tempTag.clickContent(item,tag)}
                                          </Balloon>
                                }):null
                            }
                            </div>
                          </td>
                        </tr>

                      </table>
                    </td>
                    <td valign="top">
                      {
                        item.BuyerOrders.length == 0 ?
                          this.relevanceProductRender(SellerOrder.OrderItems) : null
                      }
                      {
                        BuyerOrders.map((itemBuyList, buyerOrderIndex) =>
                          <table class="orderTables table-style02">
                            <tr>
                              <td colspan="2" class="orderTables-headerTd">
                                <div class="orderTables-header" style={{ backgroundColor: "#f6f9fd" }}>

                                  <div class="orderTables-header-left">
                                    <div style={{ display: "flex", alignItems: 'center' }}>
                                      {
                                        this.state.orderStatusIndex == 0 && this.state.purchaseOrderStatusIndex != 1 ? <TagType type={itemBuyList.BuyerOrder.BuyOrderTypeSign} /> : null
                                      }
                                      {/* {
                                        (this.state.orderStatusIndex == 0 && this.state.purchaseOrderStatusIndex == 3) || this.state.orderStatusIndex != 0 ?
                                        <TagType type={itemBuyList.BuyerOrder.BuyOrderTypeSign} />
                                        :
                                        <PlatformName platformType={itemBuyList.BuyerOrder.PlatformType != null ? itemBuyList.BuyerOrder.PlatformType : 'AlibabaZhuKe'} isHidePatformName={true} />
                                      } */}
                                      
                                      <span>
                                       
                                        {
                                          itemBuyList.BuyerOrder && itemBuyList.BuyerOrder.OrderItems
                                            && itemBuyList.BuyerOrder.OrderItems.length > 0 && itemBuyList.BuyerOrder.OrderItems[0].PreviewError == true ?
                                             this.renderOrderErrorMessageDialog(itemBuyList.BuyerOrder.OrderItems[0].PreviewErrorMessage): 
                                            itemBuyList.BuyerOrder == null || 
                                            (itemBuyList.BuyerOrder != null && (itemBuyList.BuyerOrder.PlatformOrderId == ""|| itemBuyList.BuyerOrder.PlatformOrderId == null)) 
                                            ? app.isNotNull(itemBuyList.BuyerOrder.CreateOrderErrorMessage)?
                                            this.renderOrderErrorMessageDialog(itemBuyList.BuyerOrder.CreateOrderErrorMessage):<div>采购订单:确认后生成</div>
                                            : <div>采购订单{itemBuyList.BuyerOrder.PlatformOrderId}</div>
                                        }
                                      </span>
                                      {
                                        itemBuyList.BuyerOrder != null && itemBuyList.BuyerOrder.PlatformStatus != '' && itemBuyList.BuyerOrder.PlatformStatus != null ?
                                          <span className="mL15">创建时间：{itemBuyList.BuyerOrder.CreateTime}</span>
                                          : null
                                      }


                                      {
                                        itemBuyList.BuyerOrder != null && itemBuyList.BuyerOrder.ExtField1 == "Paying" ?
                                          <text className="defBackColor" style={{ padding: "2px 2px", color: "#fff" }}>免密支付中</text>
                                          : null
                                      }
                                      {
                                        itemBuyList.BuyerOrder != null && itemBuyList.BuyerOrder.ExtField1 == "Faild" ?
                                          <text className="warnBackColor" style={{ padding: "2px 2px", color: "#fff", backgroundColor: "#fe6f4f" }}>免密支付失败，请手动支付</text>
                                          : null
                                      }

                                      {
                                        itemBuyList.BuyerOrder != null && itemBuyList.BuyerOrder.TradeType == "Alipay" && itemBuyList.BuyerOrder.ExtField1 == "Success" ?
                                          <text className="defBackColor" style={{ padding: "2px 2px", color: "#fff" }}>支付宝</text>
                                          : null
                                      }

                                      {
                                        itemBuyList.BuyerOrder != null && itemBuyList.BuyerOrder.TradeType == "Epay" && itemBuyList.BuyerOrder.ExtField1 == "Success" ?
                                          <text className="defBackColor" style={{ padding: "2px 2px", color: "#fff" }}>诚E赊</text>
                                          : null
                                      }

                                    </div>
                                  </div>
                                  {
                                    itemBuyList.BuyerOrder.PlatformType != "TaoteZhuKe" &&
                                      itemBuyList.BuyerOrder.OrderItems.length > 0 && (itemBuyList.BuyerOrder.OrderItems[0].IsMapping || itemBuyList.BuyerOrder.OrderItems[0].PlatformOrderId) ?
                                      <div class="orderTables-header-right">
                                        <span>{itemBuyList.SupplierLoginId}</span>
                                        <a href={"https://amos.alicdn.com/getcid.aw?v=3&groupid=0&s=1&charset=utf-8&uid=" + itemBuyList.SupplierLoginId + "&site=cnalichn"} target="_blank"> <i className="iconfont icon-wangwang"></i></a>
                                      </div> : null
                                  }

                                </div>
                              </td>
                            </tr>
                            {/* 采购单-商品列表 */}
                            {
                              itemBuyList.BuyerOrder != null ?
                                itemBuyList.BuyerOrder.OrderItems.map((itemBuySkuList, index) =>
                                  this.renderBuyerOrderTr(itemBuyList, itemBuySkuList, index, itemBuyList.BuyerOrder.OrderItems.length, item)
                                ) : null
                            }
                            {
                              this.state.orderStatusIndex == 0 &&  this.state.purchaseOrderStatusIndex == 3 && itemBuyList.BuyerOrder.BuyOrderType == 1 ? null :
                              (buyerOrderIndex == BuyerOrders.length - 1 ?
                                SellerOrder.OrderItems.filter(item => item.IsFenXiao != true).map((item, index) =>
                                  <tr style={{ height: '80px' }} className={(itemBuyList.BuyerOrder.OrderItems.length + index + 1) > 2 ? "hideTr tr" + (itemBuyList.BuyerOrder.OrderItems.length + index + 1) : "tr" + (itemBuyList.BuyerOrder.OrderItems.length + index + 1)}>
                                    <td colspan='2'>
                                      <div className='relevanceProductWrap'>
                                        <span class="norDefBtn" type="primary" onClick={() => this.relevanceProduct(item)}>
                                          <i className='iconfont icon-jia-copy1'></i>
                                          <span>关联货源</span>
                                        </span>
                                        <div className='relevanceProductWrap-right'>
                                          <span>1.暂无相关信息,请先<i className='dangerColor'>关联货源并匹配规格</i></span>
                                          <span>2.<i className='dangerColor'>仅需添加一次</i>，完成后该sku的全部订单自动匹配货源sku</span>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                ) : null)
                            }
                            {
                              this.moreBuyerListReader(item, itemBuyList, buyerOrderIndex)
                            }
                            {/* {
                                itemBuyList.BuyerOrder != null ?
                                  itemBuyList.BuyerOrder.OrderItems.length > 2 ?
                                    <tr><td colspan="2"><div><span className="moreShowBtn" onClick={(e) => this.moreShowProduct(e, itemBuyList.BuyerOrder.OrderItems.length)}><i className="iconfont icon-down"></i><s>展开更多</s></span></div></td></tr> : null : null
                              } */}
                            {/* 采购单 --显示物流 */}
                            {
                              itemBuyList.BuyerOrder != null && (itemBuyList.BuyerOrder.PlatformStatus == "waitbuyerreceive" || itemBuyList.BuyerOrder.PlatformStatus == "waitsellersend") ?
                                <tr>
                                  <td colspan="2">
                                    <div className="expressWrap" style={{ paddingTop: 0 }}><span>物流公司:</span><span className="mainColor">{itemBuyList.LogisticsInfo.ExpressName}</span></div>
                                    <div className="expressWrap"><span>物流单号:</span><span className="mainColor">{itemBuyList.LogisticsInfo.LogisticsBillNo}</span></div>
                                    <div style={{ padding: "5px 5px 0 5px" }}><span>物流状态:</span><span className="mainColor">{itemBuyList.LogisticsInfo.TraceInfo}</span></div>
                                  </td>
                                </tr>
                                : null
                            }

                            {/* 采购单 --地址信息 */}
                            {
                              itemBuyList.BuyerOrder != null && itemBuyList.BuyerOrder.PlatformStatus != null && itemBuyList.BuyerOrder.PlatformStatus != "" ?
                                <tr>
                                  <td colspan="2">
                                    收货地址：<i class="mainColor">{itemBuyList.BuyerOrder.ToName}，{itemBuyList.BuyerOrder.ToMobile}，{itemBuyList.BuyerOrder.ToFullAddress}</i>
                                    {
                                      itemBuyList.BuyerOrder.IsEncryptCreateOrder == "1" ? <span className='encryptIcon'> 密</span> : null
                                    }
                                    {
                                      <div className='orderTags' style={{ "display": "inline" }}>
                                        {
                                          itemBuyList.BuyerOrder.OrderTags ?
                                            itemBuyList.BuyerOrder.OrderTags.map(tag => {
                                              const tempTag = this.state.purchaseTagEnum[tag.Tag];
                                              if (!tempTag)
                                                return null;
                                              if (tempTag.predicate && tempTag.predicate(item, tag) == false)
                                                return null;

                                              if (!tempTag.clickContent)
                                                return <span className={tempTag.tagClass}>{tempTag.tagName}</span>
                                              return <Balloon type={'primary'} align="t" style={tempTag.style || { "zIndex": "10000" }} closable={false} trigger={<span className={tempTag.tagClass}>{tempTag.tagName}</span>} triggerType="click">
                                                {tempTag.clickContent(item, tag)}
                                              </Balloon>
                                            }) : null
                                        }
                                      </div>
                                    }
                                  </td>
                                </tr>
                                : null
                            }
                          </table>
                        )
                      }

                    </td>
                  </tr>
                })
              }

            </tbody>
          </table>

          <div className="agination-wrap">
            <Paginations current={this.state.current} totals={this.state.totals} pageSize={this.state.pagesize} changePageSize={(pagesize) => { this.changePageSize(pagesize) }} changePageCurrent={(current) => this.changePageCurrent(current)} />
          </div>

          {/* 商品规格映射 */}
          {/* {this.productMappingRender()} */}

        </div>

        {
          selectSourcePlatform.value != 'TaoteZhuKe' ?
            <div className="zk-footer">
              {
                this.state.purchaseOrderStatusIndex == 1 && this.state.selectPurchaseOrderList.length > 50 ?
                  <div className="zk-footer-wran warn-wrap">
                    <i className="icon">!</i>
                    <s style={{ padding: "0 5px 0 0" }}>
                      当前选择<em style={{ fontSize: "16px", color: "#ff511c" }}>{this.state.selectPurchaseOrderList.length}</em>采购单超过
                      <s style={{ fontSize: "16px", color: "#ff511c" }}>50</s>
                      笔,无法使用手动支付,建议开通自动代扣,
                    </s>
                    <s class="defColor hover" onClick={() => this.notOpenShowModalByConfirm(true)}>去开通》</s>
                  </div>
                  : null
              }

              <input type="checkbox" id="allCheck_id_Below" onClick={() => this.allCheckbox('below')} />
              <span>已勾选{this.state.selectOrderList.length}个订单</span>
              {
                this.state.orderStatusIndex == 0 &&  this.state.purchaseOrderStatusIndex == 1  &&  this.state.sourcePlatformIndex != 4?
                  <Button style={{ marginLeft: "10px" }} type="primary" onClick={() => this.confirmOrder()}>线上批量采购</Button> : null
              }
              {
                this.state.orderStatusIndex == 0 &&  this.state.purchaseOrderStatusIndex == 1  &&  this.state.sourcePlatformIndex != 4?
                  <Button style={{ marginLeft: "10px" }} type="primary" onClick={() => this.batchPrivateDomain()}>线下私域推单</Button> : null
              }
               {
                this.state.orderStatusIndex == 2 ?
                  <Button style={{ marginLeft: "10px" }} type="primary" onClick={() => this.confirmReceipt(1)}>批量确认私域订单收货</Button> : null
              }
              {
                this.state.orderStatusIndex == 0 && this.state.purchaseOrderStatusIndex == 2 ?
                  <Button style={{ marginLeft: "10px" }} type="primary" onClick={() => this.orderPayment()}>批量付款</Button> : null
              }
              {
                this.state.orderStatusIndex == 0 && this.state.purchaseOrderStatusIndex == 1?
                  <Button style={{ marginLeft: "10px" }} type="warning" onClick={() => this.ignoreOrder(1)}>批量忽略</Button> : null
              }
              {
                this.state.orderStatusIndex == 5 ?
                  <Button style={{ marginLeft: "10px" }} type="warning" onClick={() => this.ignoreOrder(0)}>取消忽略</Button> : null
              }
              {
                this.state.orderStatusIndex == 0 &&  this.state.purchaseOrderStatusIndex == 3 ?
                  <Button style={{ marginLeft: "10px" }} type="primary" onClick={() => this.reOnlineSendTask()}>重新发货</Button> : null
              }
            </div> : null
        }

        {
          selectSourcePlatform.value == 'TaoteZhuKe' && this.state.showTaoteFooter == true ?
            <div className="zk-footer">
              <span class="norDefBtn" style={{ width: '240px' }} onClick={() => { this.agreeTaoteCanNotOperate() }}>我已知晓</span>
              <i className='dangerColor zk-footer-dangerColor'>注：当前版本不支持对非1688货源订单进行操作！</i>
            </div> : null
        }

        {/* <ChangeProductsModule
          productTag={this.state.productTag}
          selectProductId={this.state.selectProductId}
          selectProductSkuId={this.state.selectProductSkuId}
          selectedShopProductImgSrc={this.state.selectedShopProductImgSrc}
          title="关联货源"
          showModal={this.state.isChangeProductsModule}
          activeSearchNavId={this.state.changeSearchNavsType}
          shopId={this.state.selectShopId}
          shopPlatformType={this.state.selectShopPlatformType}
          sureRelevanceRequest={this.sureChangeProductsModule}
          closeChangeProductsModule={this.closeChangeProductsModule}
        /> */}
        <SkuMappingsModule
          showModal={this.state.skuMappingsModuleDailog}
          shopId={this.state.skuMappingSelectProduct && this.state.skuMappingSelectProduct.ShopId}
          productId={this.state.skuMappingSelectProduct && this.state.skuMappingSelectProduct.ProductID}
          platformType={this.state.skuMappingSelectProduct && this.state.skuMappingSelectProduct.PlatformType}
          selectProductSkuId={this.state.skuMappingSelectProduct && this.state.skuMappingSelectProduct.SkuID}
          selectOrderCode={this.state.skuMappingSelectProduct && this.state.skuMappingSelectProduct.OrderCode}
          orderItemCode={this.state.skuMappingSelectProduct && this.state.skuMappingSelectProduct.OrderItemCode}
          relationData={this.state.skuMappingsModuleRelationData}
          saveSure={this.skuMappingSaveSure}
          closeSkuMappingsModule={this.closeSkuMappingsModule}
          isShowAddSupplierProduct={this.state.skuMappingShowAddSupplierProduct}
          showAddSupplierProduct={this.skuMappingShowAddSupplierProduct}
          isShowDelSupplierProduct={this.state.skuMappingShowAddSupplierProduct}
          titleName="更换货源规格"
        ></SkuMappingsModule>
        <ChangeProductsModuleV2
          selectProductId={this.state.selectProductId}
          selectProductSkuId={this.state.selectProductSkuId}
          selectedShopProductImgSrc={this.state.selectedShopProductImgSrc}
          shopId={this.state.selectShopId}
          shopPlatformType={this.state.selectShopPlatformType}
          title="关联货源"
          showModal={this.state.isChangeProductsModule}
          activeSearchNavId={this.state.changeSearchNavsType}
          isTempRelevanceProduct={this.state.isTempRelevanceProduct}
          changeProductsModuleAction={this.state.changeProductsModuleAction}
          changeSupplierProduct={this.state.changeSupplierProduct}
          closeChangeProductsModule={this.closeChangeProductsModule}
          sureRelevanceRequest={this.sureChangeProductsModule}
          saveSureSupplierProduct={this.saveSureChangeProduct}
          relationData={this.state.skuMappingsModuleRelationData}
          isReturnSelectSupplierProduct={this.state.isReturnSelectSupplierProduct}
          orderItemCode={this.state.tempOrderItemCode}
          orderCode={this.state.tempOrderCode}
        />
        <SingleCheckSkuModule
          showModal={this.state.singleCheckSkuModuleDailog}
          title={'编辑采购单规格'}
          selectProduct={this.state.singleCheckSkuSelectSupplierProduct}
          selectSupplierProductId={this.state.singleCheckSkuSelectSupplierProductId}
          selectSupplierProductSourcePlatform={this.state.singleCheckSkuSelectSupplierProductSourcePlatform}
          selectedSkuId={this.state.singleCheckSkuData && this.state.singleCheckSkuData.buyerOrderItem && this.state.singleCheckSkuData.buyerOrderItem.SkuID}
          mappingCount={this.state.singleCheckSkuData && this.state.singleCheckSkuData.buyerOrderItem && this.state.singleCheckSkuData.buyerOrderItem.Count}
          saveSure={this.saveEditSkuMappingConfirm}
          closeShowModal={this.closeEditSkuMapping}
        />
        <MultiProductSkuMappingModule
          showDialog={this.state.multiProductSkuMappingModuleDailog}
          closeProductMapping={this.closeProductMapping}
          saveSure={this.multiProductSkuMappingSaveSure}
          products={this.state.multiProductSkuMappingModuleList}
        />
        <Loading isLoading={this.state.isLoading} hasBorder={true} isShade={false} isStopOperate={true} title={this.state.loadingTitle} />
        <ShowModal width={"520px"} titleName="提示" showModal={this.state.taoteCanNotOperateDailog} hideBtn={true} showRightTopBtn={true} cancelDailog={() => this.closeModal("taoteCanNotOperateDailog")}>
          <div className="showModalWrap-box-commonContent" style={{ fontSize: "14px", padding: "10px", lineHeight: "26px" }}>
            <div className="warnColor" style={{ fontSize: '16px', padding: '20px', display: 'flex', justifyContent: 'center' }}><i className="iconfont icon-gantan icofontStatus"></i>当前版本不支持对非1688货源订单进行操作！</div>
          </div>
          <div className="showModalWrap-box-commonfooter">
            <span className="showModalWrap-box-footer-btn" onClick={() => this.closeModal("taoteCanNotOperateDailog")}>我知道了</span>
          </div>
        </ShowModal>
        <ShowModal width={"480px"} titleName="提示" showModal={this.state.pddLocalDepotTagDailog} hideBtn={true} showRightTopBtn={true} cancelDailog={() => this.closeModal("pddLocalDepotTagDailog")}>
          <div className="showModalWrap-box-commonContent" style={{ fontSize: "14px", padding: "10px" }}>
            <div>本地仓订单平台无需商家发货，且无订单收件地址，不支持采购下单。具体请至拼多多<a href='https://mms.pinduoduo.com/' target='_blank'>商家后台</a>进行查询。</div>
          </div>
          <div className="showModalWrap-box-commonfooter">
            <span className="showModalWrap-box-footer-btn" onClick={() => this.closeModal("pddLocalDepotTagDailog")}>我知道了</span>
          </div>
        </ShowModal>
        <ShowModal width={"500px"} showModal={this.state.isShowAuth} hideBtn={true} >
          <div className="showModalWrap-box-commonContent" style={{ fontSize: "16px", padding: "20px" }}>
            <div className="showModalWrap-commonContent-item">
              <i className="iconfont icon-gantan icofontStatus"></i>
              <span>您有店铺授权已失效，请前往店铺列表进行授权。</span>
            </div>

            <div style={{ paddingLeft: "36px", marginBottom: "10px", marginTop: "10px" }}>授权失效将不能进行订单回流采购和自动发货</div>

          </div>
          <div className="showModalWrap-box-commonfooter">
            <span className="showModalWrap-box-footer-btn" data-logger-action-type="dgj_action_authorize" onClick={() => this.gotoShopList()}>前往授权</span>
            <span className="showModalWrap-box-footer-btn cancleBtn" onClick={() => this.closeModal("isShowAuth")}>关闭</span>
          </div>


        </ShowModal>

        {/* 提示未映射 */}
        <ShowModal showModal={this.state.isShowModalBynotCategory} titleName={"提示"} hideBtn={false}
          cancelDailog={this.cancelNotCategoryByShowModal} sureDailog={this.notCategoryByShowModalByOk}>
          <div className="showModalWrap-box-commonContent notCategory-wrap">
            <div className="showModalWrap-commonContent-item" style={{ padding: "20px 20px 0 20px", fontSize: "16px" }}>
              <i className="iconfont icon-gantan icofontStatus"></i>
              <span>有订单商品未匹配规格，前往匹配规格：</span>
            </div>
            <div className="showModalWrap-commonContent-item notCategory">
              {this.state.notCategoryListTitle}
            </div>
          </div>
        </ShowModal>

      {/* 提示未映射2(New)，包含已映射的，可以忽略 */}
        <ShowModal width={"500px"} showModal={this.state.isShowModalBynotCategoryDouble} hideBtn={true} showRightTopBtn={true} cancelDailog={()=>{ this.closeModal("isShowModalBynotCategoryDouble")}} titleName={"商品未匹配规格提示"}>
          <div className="showModalWrap-box-commonContent" style={{ fontSize: "16px", padding: "20px" }}>

             <div style={{marginBottom: "10px", marginTop: "30px" }}>检测到有订单商品未匹配规格，是否继续下单</div>

          </div>
          <div className="showModalWrap-box-commonfooter">
            <span className="showModalWrap-box-footer-btn cancleBtn showModalWrap-box-footer-btn-hover" style={{border: "1px solid #b9ceff",color:"#5584ff"}} onClick={() => this.sectorMapByShowModalByOk()}>继续下单（已匹配规格）</span>
            <span className="showModalWrap-box-footer-btn" style={{marginLeft: "10px" }} onClick={() => this.notCategoryByShowModalByOk()}>去匹配规格</span>
            {/* <span className="showModalWrap-box-footer-btn cancleBtn" onClick={() => this.closeModal("isShowModalBynotCategoryDouble")}>关闭</span> */}
          </div>
        </ShowModal>


        {/* 统一的错误弹窗 */}
        <ShowModal width={"500px"} showModal={this.state.isShowCommonError} hideBtn={true} >
          <div className="showModalWrap-box-commonContent" style={{ fontSize: "16px", padding: "10px" }}>
            <div style={{ paddingLeft: "16px", marginBottom: "10px", marginTop: "10px" }}>
              {this.state.showCommonErrorMessage}
            </div>
          </div>
          <div className="showModalWrap-box-commonfooter">
            <span className="showModalWrap-box-footer-btn cancleBtn" onClick={() => this.closeModal("isShowCommonError")}>关闭</span>
          </div>
        </ShowModal>


        {/* 选择付款方式，提示 */}
        <ShowModal showModal={this.state.isShowModalBySelectPayment} hideBtn={true} titleName={'待付款金额' + this.state.showModalByPaymentPaymentMoney + '元'} >
          <div className="showModalWrap-box-commonContent">
            {
              this.state.isShowAutoPayButton == true ?
                <div className="showModalWrap-commonContent-item" style={{ padding: "20px", fontSize: "16px" }}>
                  <i className="iconfont icon-gantan icofontStatus"></i>
                  <span>免密支付优先使用诚e赊代扣,若失败则使用支付宝代扣</span>
                </div>
                :
                <div className="showModalWrap-commonContent-item" style={{ padding: "20px", fontSize: "16px" }}>
                  <i className="iconfont icon-wenhao icofontStatus"></i>
                  <span>是否使用手动支付？</span>
                </div>
            }
          </div>
          <div className="showModalWrap-box-commonfooter">
            <span className="showModalWrap-box-footer-btn" style={{ marginLeft: "5px" }} onClick={() => this.selectPaymentShowModalByManual()}>手动支付</span>
            {
              this.state.isShowAutoPayButton == true ?
                <span className="showModalWrap-box-footer-btn" style={{ marginLeft: "5px" }} onClick={() => this.selectPaymentShowModalByConfirm()}>免密支付</span>
                : null
            }
            <span className="showModalWrap-box-footer-btn cancleBtn" onClick={() => this.selectPaymentShowModalByClose()}>关闭</span>
          </div>
        </ShowModal>

        {/* 获取支付链接（手动支付的方式），有错误的 提示弹框，提示 */}
        <ShowModal showModal={this.state.isShowModalByPayUrl} hideBtn={true} titleName={'提示'} >
          <div className="showModalWrap-box-commonContent">
            <div className="showModalWrap-commonContent-item" style={{ padding: "20px", fontSize: "16px" }}>
              <i className="iconfont icon-gantan icofontStatus"></i>
              <span>是否已手动支付成功？</span>
            </div>
          </div>
          <div className="showModalWrap-box-commonfooter">
            <span className="showModalWrap-box-footer-btn" onClick={() => this.payUrlShowModalByConfirm()}>已支付并刷新</span>
            <span className="showModalWrap-box-footer-btn cancleBtn" onClick={() => this.closeModal("isShowModalByPayUrl")}>关闭</span>
          </div>
        </ShowModal>

        {/* 自动代扣失败，提示 */}
        <ShowModal showModal={this.state.isShowModalByAutoPaymentError} hideBtn={true} titleName={'提示'} >
          <div className="showModalWrap-box-commonContent">
            <div className="showModalWrap-commonContent-item" style={{ padding: "20px", fontSize: "16px" }}>
              <i className="iconfont icon-add-fill-hover-copy icofontStatus"></i>
              <span>自动代扣失败，请使用手动支付</span>
            </div>

          </div>
          <div className="showModalWrap-box-commonfooter">
            <span className="showModalWrap-box-footer-btn" onClick={() => this.autoPaymentErrorShowModalByConfirm()}>手动支付</span>
            <span className="showModalWrap-box-footer-btn cancleBtn" onClick={() => this.autoPaymentErrorShowModalByClose()}>关闭</span>
          </div>
        </ShowModal>


        {/* 自动代扣成功，提示 */}
        <ShowModal showModal={this.state.isShowModalByAutoPaymentSuccess} hideBtn={true} titleName={'提示'} >
          <div className="showModalWrap-box-commonContent">
            <div className="showModalWrap-commonContent-item" style={{ padding: "20px 20px 0 20px", fontSize: "16px" }}>
              <span>已对{this.state.autoPaymentSuccessPayingOrderIds.length}笔采购单发起免密支付</span>
            </div>
            <div className="showModalWrap-commonContent-item" style={{ padding: "20px 20px 0 20px", fontSize: "16px" }}>
              {this.state.autoPaymentSuccessNotWaitPayIds.length > 0 ? <span>有{this.state.autoPaymentSuccessNotWaitPayIds.length}个订单不属于待付款！</span> : null}
              {this.state.autoPaymentSuccessFaildOrderIds.length > 0 ? <span>有{this.state.autoPaymentSuccessFaildOrderIds.length}个订单发起失败！</span> : null}
              <span> 请耐心等待支付结果</span>
            </div>
            <div className="showModalWrap-commonContent-item" style={{ padding: "20px", fontSize: "16px" }}>
              <span style={{ color: "#f7941f" }}>温馨提示：可到个人中心设置开通。</span>
            </div>
          </div>

          <div className="showModalWrap-box-commonfooter">
            <span className="showModalWrap-box-footer-btn cancleBtn" onClick={() => this.autoPaymentSuccessShowModalByConfirm()}>关闭</span>
          </div>
        </ShowModal>

        {/* 检测没开启自动代扣，勾选超过数量时，提示（超过显示数据就不提示） */}
        <ShowModal showModal={this.state.isShowModalByBatchOpen} hideBtn={true} titleName={'提示'} >
          <div className="showModalWrap-box-commonContent">
            <div className="showModalWrap-commonContent-item" style={{ padding: "20px", fontSize: "16px" }}>
              <i className="iconfont icon-gantan icofontStatus"></i>
              <span>批量手动付款最多只支持50笔。</span>
              <span style={{ color: "#000" }}>自动代扣不限制。</span>
            </div>
          </div>

          <div className="showModalWrap-box-commonfooter">
            <span className="showModalWrap-box-footer-btn" onClick={() => this.batchOpenShowModalByConfirm()}>确定</span>
            <span className="showModalWrap-box-footer-btn cancleBtn" onClick={() => this.batchOpenShowModalByClose()}>不在提示</span>

          </div>
        </ShowModal>


        {/* 多货源支付时，弹窗选择，提示  showModal={this.state.isShowMoreTypePay}  */}
        <ShowModal showModal={this.state.isShowMoreTypePay} hideBtn={true} titleName={'待支付'} >
          <div className="showModalWrap-box-commonContent showMoreTypePayWrap">
            <div className='showMoreTypePayWrap-title'>系统检测到您有多个采购平台订单，无法一起支付!请选择采购平台后分别支付!</div>
            <ul className='showMoreTypePayWrap-ul'>
              <li className='showMoreTypePayWrap-ul-li'>
                <span>待付款笔数:{this.state.aliPayOrderCodeList.length}笔</span>
                <span></span>
                <i className='norDefBtn' onClick={() => { this.closeModal("isShowMoreTypePay"); this.getOrderPayType() }}>支持阿里支付</i>
              </li>
              <li className='showMoreTypePayWrap-ul-li'>
                <span>待付款笔数:{this.state.taoTePayOrderCodeList.length}笔</span>
                <span></span>
                <span style={{color:"#5584ff",fontSize:"13px"}}>当前版本不支持对非1688货源订单进行操作！</span>
              </li>
            </ul>
          </div>

          <div className="showModalWrap-box-commonfooter">
            <span className="showModalWrap-box-footer-btn cancleBtn" onClick={() => this.closeModal("isShowMoreTypePay")}>关闭</span>
          </div>
        </ShowModal>

        {/* 弹窗---发货失败导出 */}
        <ShowModal width={550} showModal={this.state.isShowModalByExportSelet} hideBtn={true} titleName={'请选择导出格式'} >
          <div className="showModalWrap-box-commonContent" style={{ padding: "20px" }}>
            <div className="showModalWrap-commonContent-item" style={{ marginBottom: "20px" }}>
              <label style={{ marginRight: "50px" }}>
                <input type="radio" name='exportSeletName' value="csv" style={{ marginRight: "3px" }} />CSV
              </label>
              {/* 店铺版本还需要修复Excel，才可以放开 */}
              <label>
                <input type="radio" name='exportSeletName' value="excel" style={{ marginRight: "3px" }} />Excel
              </label>
            </div>

            <div className="showModalWrap-commonContent-item" style={{ lineHeight: "22px" }}>
              <span>温馨提示：选择CSV格式导出后，<span style={{ color: "red" }}>请勿编辑</span>改格式的内容。可直接到平台店铺的后台<span style={{ color: "red" }}>批量导入发货</span></span>
            </div>
          </div>
          <div className="showModalWrap-box-commonfooter">
            <span className="showModalWrap-box-footer-btn" onClick={() => this.exportSendErrorOrderByType()}>确定导出</span>
            <span className="showModalWrap-box-footer-btn cancleBtn" onClick={() => this.closeModal("isShowModalByExportSelet")}>关闭</span>
          </div>
        </ShowModal>

        <ShowModal width={"520px"} showModal={this.state.allOrderSendChangeAddressDialog} hideBtn={true} showRightTopBtn={true} cancelDailog={() => this.closeModal("allOrderSendChangeAddressDialog")}>
            <div className="showModalWrap-box-commonContent" style={{ fontSize: "14px", padding: "10px",lineHeight:"26px"}}>
                <div style={{ paddingLeft: "16px", marginBottom: "10px"}}>
                  {
                    this.state.shopList.find(x => x.Id == this.state.newSelectShopId) && this.state.shopList.find(x => x.Id == this.state.newSelectShopId).PlatformType == 'TouTiao'?
                    <div>
                      <div>因抖音平台要求</div>
                      <div>发货使用的买家电话、地址信息必须与订单实际最新电话、地址信息一致</div>
                      <div>系统识别到您选择的订单中包含收件人信息已变更订单</div>
                      <div>请点击采购单右侧<span style={{fontWeight:"800"}}>【取消订单】</span>进行申请采购单退款并且退款成功后再重新下单</div>
                    </div>:
                    <div>
                      <div>因快手平台要求</div>
                      <div>发货使用的买家地址信息必须与订单实际最新地址信息一致</div>
                      <div>系统识别到您选择的订单中包含买家已变更地址订单</div>
                      <div>请点击采购单右侧<span style={{fontWeight:"800"}}>【取消订单】</span>进行申请采购单退款并且退款成功后再重新下单</div>
                    </div>
                  }
                </div>
            </div>
            <div className="showModalWrap-box-commonfooter">
                <span className="showModalWrap-box-footer-btn" onClick={() => this.closeModal("allOrderSendChangeAddressDialog")}>我知道了</span>
            </div>
        </ShowModal>

        {/* 取消订单，点击后一秒弹出 */}
        <ShowModal showModal={this.state.isShowModalByCancelExamine} hideBtn={true} titleName={'提示'}>
          <div className="showModalWrap-box-commonContent">
            <div className="showModalWrap-commonContent-item" style={{ padding: "20px", fontSize: "16px" }}>
              <i className="iconfont icon-wenhao icofontStatus"></i>
              <span>是否已成功取消了订单？</span>
            </div>

          </div>
          <div className="showModalWrap-box-commonfooter">
            <span className="showModalWrap-box-footer-btn" onClick={() => this.cancelExamineShowModalByConfirm()}>已取消并刷新</span>
            <span className="showModalWrap-box-footer-btn cancleBtn" onClick={() => this.closeModal("isShowModalByCancelExamine")}>关闭</span>
          </div>
        </ShowModal>
        <ShowModal
          titleName={'确定是否更换'}
          showLeftTopBtn={true}
          width={500}
          showModal={this.state.isOnlyOrderDialog}
          skin={"isOnlyOrderDialog"}
          hideBtn={true}
          zIndex={1001}
          className={'isOnlyOrderDialogWarp'}
          cancelDailog={() => this.closeModal('isOnlyOrderDialog')} >
          <div className='isOnlyOrderDialogRadio showModalWrap-box-commonContent'>
            <div className='isOnlyOrderDialogRadioItem'>
              <input type="radio" name='only_order' value='1' />
              <span>仅针对这笔订单</span>
              <div>
                <span>不保存关联关系，下次下单还是使用原货源规格</span>
              </div>
            </div>
            {/* <div className='isOnlyOrderDialogRadioItem'>
                <input type="radio" name='only_order' value='0'/>
                <span>此店铺商品产生的订单全部更换为新货源</span>
                <div>
                  <span>保存关联关系，下次下单全部使用新货源</span>
                </div>
              </div> */}
          </div>
          <div className="showModalWrap-box-commonfooter">
            <span onClick={() => this.saveEditSkuMapping()} style={{ display: 'flex' }}
              className="showModalWrap-box-footer-btn">确定关联</span>
            <span onClick={() => this.setState({ isOnlyOrderDialog: false })} className="showModalWrap-box-footer-btn cancleBtn">关闭</span>
          </div>
        </ShowModal>

        {/* 解密失败弹窗 */}
        <ShowModal width={"540px"} showModal={this.state.encryFialdDialog} hideBtn={true} titleName={'确认'} >
          <div className="showModalWrap-box-commonContent" style={{ "fontSize": "14px", "marginLeft": "30px", "marginTop": "10px" }}>
            <div>
              {/* 订单{ this.state.encryFaildPlatformOrderId }, */}
              解密失败：{this.state.encryErrorMessage}
            </div>
            <p></p>
            <div>
              <span>订单密文下单，不消耗店铺解密额度。</span>
              <a href="https://docs.qq.com/doc/DYkFjV3R2TFZKUnZn" target="_blank" style={{ "fontSize": "12px" }}> 点击了解详情</a>
            </div>
          </div>
          <div className="showModalWrap-box-commonfooter">
            <span className="showModalWrap-box-footer-btn" onClick={() => { hashHistory.push("/supplierMarke") }}>去打标</span>
            <span className="showModalWrap-box-footer-btn cancleBtn" onClick={() => { this.closeModal("encryFialdDialog") }}>关闭</span>
          </div>
        </ShowModal>

        {/* 中转订单，需要密文方式下单 */}
        <ShowModal width={"540px"} showModal={this.state.encryFialdDialogByZhongZhuan} hideBtn={true} titleName={'确认'} >
          <div className="showModalWrap-box-commonContent" style={{ "fontSize": "14px", "marginLeft": "30px", "marginTop": "10px" }}>
            <div>
              检测到当前中转订单未使用密文下单。<span style={{ "color": "red" }}>由于中转订单下单只能使用中转地址，供应商必须使用{this.state.selectShopPlatformType =="TouTiao"?<span>抖音</span>:this.state.selectShopPlatformType =="KuaiShou"?<span>快手</span>:null} 电子面单进行打印，否则会造成买家收不到货而产生纠纷。</span>
            </div>
            <div>
              如确认供应商已支持使用{this.state.selectShopPlatformType =="TouTiao"?<span>抖音</span>:this.state.selectShopPlatformType =="KuaiShou"?<span>快手</span>:null}电子面单进行打印，请前往【订单管理】》【下单设置】中对供应商进行标记使用密文下单
            </div>
            <div>
              <a href="https://docs.qq.com/doc/DYkFjV3R2TFZKUnZn" target="_blank" style={{ "fontSize": "12px" }}> 点击了解密文详情</a>
            </div>
          </div>
          <div className="showModalWrap-box-commonfooter">
            <span className="showModalWrap-box-footer-btn" onClick={() => { hashHistory.push("/supplierMarke") }}>前往设置</span>
            <span className="showModalWrap-box-footer-btn cancleBtn" onClick={() => { this.closeModal("encryFialdDialogByZhongZhuan") }}>关闭</span>
          </div>
        </ShowModal>


        {/* 限制明文下单，提示指引 */}
        <ShowModal width={"540px"} showModal={this.state.noEncryptErrorDialog} hideBtn={true} titleName={'提示'} >
          <div className="showModalWrap-box-commonContent" style={{ "fontSize": "14px", "marginLeft": "30px", "marginTop": "10px" }}>
            <div>
            {this.state.encryErrorMessage}
            </div>
            <p></p>
            <div>
              <span>订单密文下单，不消耗店铺解密额度。</span>
              <a href="https://docs.qq.com/doc/DYkFjV3R2TFZKUnZn" target="_blank" style={{ "fontSize": "12px" ,"color":"#0071f2"}}> 点击了解详情</a>
            </div>
          </div>
          <div className="showModalWrap-box-commonfooter">
           
             {
              this.state.selectShopPlatformType !="XiaoHongShu"?
                <span>
                  <label>
   <input type="checkbox" 
           id="no_encrypt_error_check"
           name="no_encrypt_error_check_name"
            />
                  <span>不再提示</span>
                  </label>
                </span>
                :null
            }
            {
              this.state.selectShopPlatformType !="XiaoHongShu"?
              <span className="showModalWrap-box-footer-btn cancleBtn" onClick={() => this.confirmOrderByContinue()}>继续解密采购</span>:null
            }
            <span className="showModalWrap-box-footer-btn"  style={{"marginLeft": "5px"}} onClick={() =>this.gotoSupplierMarke()}>密文下单设置</span> 
            <span className="showModalWrap-box-footer-btn cancleBtn" onClick={() => { this.closeModal("noEncryptErrorDialog") }}>关闭</span>
          </div>
        </ShowModal>

        


        
        {/* 确认采购订单，有失败的，会弹这个框  New */}
        <ShowModal showModal={this.state.isShowModalByCreateOrderError} hideBtn={true} titleName={'采购单生成错误'} >
          <div className="showModalWrap-box-commonContent orderError-wrap" style={{ padding: "15px", fontSize: "16px" }}>
            {
              this.state.createOrderError.map((item) =>

                <div className="newDialog-content-tr">
                  {/* 第一列 */}
                  <div className="newDialog-content-td">
                    {
                      item.SalesOrderIds.map((itemOrderList) =>
                        <span className="fS10">{itemOrderList}</span>
                      )
                    }
                  </div>
                  {/* 第二列 */}
                  <div className="newDialog-content-td">
                    <span className="fS10">{item.BuyerOrderId}</span>
                  </div>
                  {/* 第三列 */}
                  <div className="newDialog-content-td">
                    <span className="fS10">{item.ErrorMessage}</span>
                  </div>
                </div>

              )
            }
          </div>
          <div className="showModalWrap-box-commonfooter">
            <span className="showModalWrap-box-footer-btn cancleBtn" onClick={() => { this.closeModal("isShowModalByCreateOrderError") }}>确认关闭</span>
          </div>
        </ShowModal>


        <ShowModal width={"520px"} showModal={this.state.orderPayChangeAddressDialog} hideBtn={true} showRightTopBtn={true} cancelDailog={() => this.closeModal("orderPayChangeAddressDialog")}>
            <div className="showModalWrap-box-commonContent" style={{ fontSize: "14px", padding: "10px",lineHeight:"26px"}}>
                <div style={{ paddingLeft: "16px", marginBottom: "10px", marginTop: "10px" }}>

                    {
                      this.state.selectShopPlatformType == "TouTiao"?
                      <div>
                        <div>因抖音平台要求</div>
                        <div>发货使用的买家电话、地址信息必须与订单实际最新电话、地址信息一致</div>
                        <div>系统识别到您选择的订单中包含收件人信息已变更订单</div>
                        <div>请手动关闭对应的采购单后使用最新地址重新下单</div>
                      </div>:
                      this.state.selectShopPlatformType == "WxVideo" ?
                      <div>
                        <div>系统识别到您选择的订单中包含收件人信息已变更订单</div>
                        <div>请点击采购单右侧【取消订单】进行关闭采购单后重新下单</div>
                      </div>:
                      <div>
                        <div>因快手平台要求</div>
                        <div>发货使用的买家地址信息必须与订单实际最新地址信息一致</div>
                        <div>系统识别到您选择的订单中包含买家已变更地址订单</div>
                        <div>请手动关闭对应的采购单后使用最新地址重新下单</div>
                      </div>
                    }
                    
                </div>
            </div>
            <div className="showModalWrap-box-commonfooter">
                <span className="showModalWrap-box-footer-btn" onClick={() => { this.orderPayment(null,true);this.closeModal("orderPayChangeAddressDialog")}}>忽路此订单，先付款其他订单</span>
            </div>
        </ShowModal>
        
        <ShowModal titleName={'申请提额'} width={"300px"} showModal={this.state.noEncryptLinkDialog} hideBtn={true} showRightTopBtn={true} cancelDailog={() => this.closeModal("noEncryptLinkDialog")}>
            <div className="showModalWrap-box-commonContent" style={{ fontSize: "14px", padding: "10px"}}>
                <div style={{ paddingLeft: "16px", marginBottom: "10px", marginTop: "10px" }}>
                     请选择平台前往申请提额解密额度
                     <ul class="newAddShop-main">
                  {this.state.encryptLinkPlatforms.map((item,index)=>  
                    <li onClick={(event) => this.changeShop2(event)}>
                        <a href={item.link} style={{color:"#333333"}} target="_blank"><PlatformName platformType={item.value} iconSize={"middleIcon"} isHidePatformName={true} />
                        <span class="pintaiName">{item.title}</span></a>
                    </li>
                    
                  )}
              </ul>
                </div>
            </div>
          
        </ShowModal>

        <ShowModal width={"520px"} showModal={this.state.allOrderPayChangeAddressDialog} hideBtn={true} showRightTopBtn={true} cancelDailog={() => this.closeModal("allOrderPayChangeAddressDialog")}>
            <div className="showModalWrap-box-commonContent" style={{ fontSize: "14px", padding: "10px",lineHeight:"26px"}}>
                <div style={{ paddingLeft: "16px", marginBottom: "10px", marginTop: "10px" }}>
                  {
                     this.state.selectShopPlatformType == "TouTiao"?
                     <div>
                        <div>因抖音平台要求</div>
                        <div>发货使用的买家电话、地址信息必须与订单实际最新电话、地址信息一致</div>
                        <div>系统识别到您选择的订单中包含收件人信息已变更订单</div>
                        <div>请点击采购单右侧<span style={{fontWeight:"800"}}>【取消订单】</span>进行关闭采购单后再重新下单</div>
                     </div>:
                     this.state.selectShopPlatformType == "WxVideo" ?
                     <div>
                       <div>系统识别到您选择的订单中包含收件人信息已变更订单</div>
                       <div>请点击采购单右侧【取消订单】进行关闭采购单后重新下单</div>
                     </div>:
                     <div>
                        <div>快手平台要求</div>
                        <div>发货使用的买家地址信息必须与订单实际最新地址信息一致</div>
                        <div>系统识别到您选择的订单中包含买家已变更地址订单</div>
                        <div>请点击采购单右侧<span style={{fontWeight:"800"}}>【取消订单】</span>进行关闭采购单后再重新下单</div>
                      </div>
                  }
                  
                </div>
            </div>
            <div className="showModalWrap-box-commonfooter">
                <span className="showModalWrap-box-footer-btn" onClick={() => this.closeModal("allOrderPayChangeAddressDialog")}>我知道了</span>
                {
                  this.state.selectShopPlatformType =="WxVideo"?
                  <span className="showModalWrap-box-footer-btn" onClick={() => { this.orderPayment(null,true);this.closeModal("allOrderPayChangeAddressDialog")}}>继续付款</span>
                  :null
                }
            </div>
        </ShowModal>
        <BatchModule title="私域推单" createPurchaseOrder={(e) =>this.createPurchaseOrder(e) }  isModal={this.state.isModal} list={this.state.selectOrderList} dataList={this.state.supplierList} close={()=> this.setState({isModal: false})}/>
          {/* 取消私域推单 */}
        <ShowModal showModal={this.state.isCancelPrivateDomain} hideBtn={true} width={350} titleName={'提示'}>
          <div className="showModalWrap-box-commonContent">
            <div className="showModalWrap-commonContent-item" style={{ padding: "20px", fontSize: "16px" }}>
              <i className="iconfont icon-wenhao icofontStatus"></i>
              <span>确定取消私域推单？</span>
            </div>

          </div>
          <div className="showModalWrap-box-commonfooter">
            <span className="showModalWrap-box-footer-btn" onClick={() => this.cancelPrivateDomainConfirm()}>确认取消</span>
            <span className="showModalWrap-box-footer-btn cancleBtn" onClick={() => this.closeModal("isCancelPrivateDomain")}>我再想想</span>
          </div>
        </ShowModal>
        {/* 同步订单弹窗 */}
        <ShowModal titleName={"同步订单"} showModal={this.state.isSyncOrderModal} hideBtn={true}>
          <TableNavChange distributionStatus={this.state.changeSearchSyncOrderNavs} noShowNum={true} changeNav={this.changeSyncOrderNav} />
          <div>
            {/* 店铺订单同步 */}
            <div className="showModalWrap-commonContent-item" style={this.state.syncOrderActiveId == '0' ? { display: 'inline' } : { display: 'none' }}>
              {

                <div>
                  <div>
                    <span className="noneData-title">温馨提示:</span><br />
                    <span className="noneData-title">*当店铺有了订单(并且是还未采购状态),软件里如果刷新不出订单,可输入订单号同步订单</span><br />
                    <span className="noneData-title">*全量同步订单数据需要一定的时间，会在后台进行，关闭本页面不影响同步效果，请放心操作</span>
                  </div>
                  <div style={{ marginTop: 20 }}>
                    <h3 style={{fontWeight:"bold"}}>方式一:按订单号同步</h3>
                  </div>
                  <div className='mywrap'>
                    <label>
                      <input style={{ marginTop: 0, width: 380 }} type="text" id="syncShopOrderIdTxt" placeholder="多个平台订单编号(，)分隔,且同步订单不能超过10个" />
                    </label>
                    <Button style={{ marginLeft: "10px" }} type="primary" onClick={() => this.syncOrderByIds(1, 'syncShopOrderIdTxt')}>开始同步</Button>
                  </div>
                  <div style={{ marginTop: 20 }}>
                    <h3 style={{fontWeight:"bold"}}>方式一:按时间段同步</h3>
                  </div>
                  <div className='mywrap'>
                    <select id="syncShopOrderTimeSel" style={{ marginRight: '10px', width: 380 }}>
                      <option value="1" selected>全量同步近24小时订单</option>
                      <option value="3">全量同步近3天订单</option>
                      <option value="7">全量同步近7天订单</option>
                    </select>
                    {
                      this.state.sysncOrderStatusTaskProgress == 100 || this.state.sysncOrderStatusTaskProgress == "100" ?
                        this.state.isShowSyncOrderShopCdt == false ? <Button type="primary" onClick={() => this.syncOrder('syncShopOrderTimeSel')}>开始同步</Button> :
                          <Button style={{ cursor: "not-allowed", backgroundColor: "#ccc", borderColor: "#ccc", color: "white" }} ><CountdownTimerBySecond isEnable={this.state.isShowSyncOrderShopCdt} data={this.state.syncOrderShopCdtSeconds} onComplete={() => this.countDownTimerComplete(0)} /></Button>
                        : <Button type="primary" >正在同步中..</Button>
                    }
                  </div>
                </div>

              }
            </div>

            <div className="showModalWrap-commonContent-item" style={this.state.syncOrderActiveId == '1' ? { display: 'inline' } : { display: 'none' }}>
              {
                <div>
                  <div>
                    <span className="noneData-title">温馨提示:</span><br />
                    <span className="noneData-title">*当发现软件内1688采购单状态与1688买家账号内不一致时,可输入1688订单号同步订单</span><br />
                    <span className="noneData-title">*全量同步订单数据需要一定的时间，会在后台进行，关闭本页面不影响同步效果，请放心操作</span>
                  </div>
                  <div style={{ marginTop: 20 }}>
                    <h3 style={{fontWeight:"bold"}}>方式一:按订单号同步</h3>
                  </div>
                  <div className='mywrap'>
                    <label>
                      <input style={{ marginTop: 0, width: 380 }} type="text" id="syncShopAlibabaOrderIdTxt" placeholder="多个平台订单编号(，)分隔,且同步订单不能超过10个" />
                    </label>
                    <Button style={{ marginLeft: "10px" }} type="primary" onClick={() => this.syncOrderByIds(2, 'syncShopAlibabaOrderIdTxt')}>开始同步</Button>
                  </div>
                  <div style={{ marginTop: 20 }}>
                    <h3 style={{fontWeight:"bold"}}>方式一:按时间段全量同步</h3>
                  </div>
                  <div className='mywrap'>
                    <select id="syncShopAlibabaOrderTimeSel" style={{ marginRight: '10px', width: 380 }}>
                      <option value="1" selected>全量同步近24小时订单</option>
                      <option value="3">全量同步近3天订单</option>
                      <option value="7">全量同步近7天订单</option>
                    </select>
                    {
                      this.state.sysncAlibabaOrderStatusTaskProgress == 100 || this.state.sysncAlibabaOrderStatusTaskProgress == "100" ?
                        this.state.isShowSyncOrderShopAlibabaCdt == false ? <Button type="primary" onClick={() => this.syncAliBabaOrder('syncShopAlibabaOrderTimeSel')}>开始同步</Button> :
                          <Button style={{ cursor: "not-allowed", backgroundColor: "#ccc", borderColor: "#ccc", color: "white" }} ><CountdownTimerBySecond isEnable={this.state.isShowSyncOrderShopAlibabaCdt} data={this.state.syncOrderShopAlibabaCdtSeconds} onComplete={() => this.countDownTimerComplete(1)} /></Button>
                        : <Button type="primary" >正在同步中..</Button>
                    }

                  </div>
                </div>
              }
            </div>

          </div>
          <div className="showModalWrap-box-commonfooter">
            <span onClick={() => this.setState({ isSyncOrderModal: false ,isShowSyncOrderShopAlibabaCdt:false })} className="showModalWrap-box-footer-btn cancleBtn">关闭</span>
          </div>
        </ShowModal>
      </div>
    );
  }
}

export default OrderList;
