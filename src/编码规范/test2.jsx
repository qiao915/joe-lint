import { createElement, Component, render } from 'rax'
import Text from 'rax-text';
import Image from 'rox-image';
import RAP from 'rap-sdk';
import { Button, Dialog, Theme, ThemeProvider, Checkbox, View } from 'rox-components';
import Icon from 'rox-icon';
import peizhi from '../../common/config.js';
import Picker from 'rox-picker';
import styles from './styles';
import Link from 'rox-link';
import Progress from 'rox-progress';
import MyShowLoading from "../../components/showLoading/index";
import '../../assets/css/allComponent.css';
import './procurementOrder.css'
//这个是上、下拉组件
import RoxStyleProvider from 'rox-theme-provider';
import ListView from 'rox-listview';
import RefreshControl from 'rox-refresh-control';
import Tabheader from 'rox-tabheader';
import SearchModal from '../../components/searchModal/index';
import Input from 'rox-input';
import ScrollView from 'rox-scrollview';
import MyShowModal from '../../components/showModal';
import NewGuide from '../../components/newGuide/newGuide';
import MyTabheader from '../../components/myTabheader/index';
import Advertising from '../../components/Advertising';

class ProcurementOrder extends Component {

  constructor() {
    super();

    this.state = {
      ownerShopUidToken: '',
      selectShopId: 0,//选择的店铺
      selectShopName: '',//选择的店铺
      selectShopPlatformType: '',//选择的店铺
      linshiRes: '',//临时查看结果
      shopList: [],//店铺列表
      purchaseOrderList: [],//订单列表

      selectTitle: "",  //选择店铺名称
      notCategoryList: [],//没有映射的信息
      notCategoryListTitle: "",//没有映射的信息，用于显示

      //筛选
      chooseDate: [{ value: "15", title: "近15天", isSelect: false }, { value: "30", title: "近30天", isSelect: true }, { value: "60", title: "近60天", isSelect: false }],
      chooseOrderTypes: [{ name: "订单编号", value: "", isSelect: false }, { name: "采购编号", value: "", isSelect: true }],
      chooseOrderTypeName: "采购编号",
      chooseOrderTypeValue: "",//input框内容
      chooseOrderShowTypes: [{ value: "0", title: "最新订单在上", isSelect: true }, { value: "1", title: "最新订单在下", isSelect: false }],

      orderIdInputValue: '',
      openUrl: '',//开通自动代扣的链接

      isShowprocurementDetails: false,//是否展示采购订单详情
      orderDetail: {},//订单详情数据
      //状态选择
      dataSource: [
        '待确认',
        '待付款',
        '待发货',
        '已发货',
        '交易完成',
        '交易关闭',
        '退款中',
        '忽略订单'
      ],
      //导航栏 new 
      dataNavs: [
        { Index: 0, Name: "待确认", IsSelect: true, Num: "" },
        { Index: 1, Name: "待付款", IsSelect: false, Num: "" },
        { Index: 2, Name: "待发货", IsSelect: false, Num: "" },
        { Index: 3, Name: "已发货", IsSelect: false, Num: "" },
        { Index: 4, Name: "交易完成", IsSelect: false, Num: "" },
        { Index: 5, Name: "交易关闭", IsSelect: false, Num: "" },
        { Index: 6, Name: "退款中", IsSelect: false, Num: "" },
        { Index: 7, Name: "忽略订单", IsSelect: false, Num: "" },
      ],

      indexs: 0,
      isAuthShop:false,//当前店铺已经授权过期
      isShowAuth:false,//是否弹窗显示
      isShowCommonError:false,
      showCommonErrorMessage:'',

      myShowLoading: false,
      showLoadingTitle: '加载中',
      isShowBatch: false,//是否显示批量按钮
      isAllChange: false,//全选的值
      createOrderTaskCode: { TaskCode: '', Ratio: 0 },

      noticeContent: '',
      noticeUrl: '',

      //超过30个是否提示，只针对开启批量的按钮有效。其他处理超过30个还是会提示
      isRemindThirty: true,

      //是否弹出  ，开通代扣  的弹框
      isRemindOpen: 1,

      selectOrderList: [],//选择的订单列表

      selectPurchaseOrderList: [],//选择的订单，对应的采购单


      detailsPlatformOrderId: '',//查看了哪个订单的详情，用于再次获取
      buyerPlatformOrderId: '',//是哪个采购单id
      buyerPlatformOrderCode: '',//是哪个采购单code
      syncOrderBySelectOrderStatus: '',//对采购单经常操作时，返回接口，会有查询

      //------------------------以下是弹框----------------------------

      //确认采购单时，没有映射-弹框
      isShowModalBynotCategory: false,

      // 批量开启时， 选择是否超过50条。提示
      isShowModalByBatchOpen: false,


      // 确认采购单，有失败的列表。提示
      isShowModalByCreateOrderError: false,
      createOrderError: [],

      //检测到没有开通自动代扣，提示
      isShowModalByNotOpen: false,

      //点击开通按钮（会跳转或者复制链接）后2秒提示这个弹框，提示
      isShowModalByVerifyOpen: false,

      //获取付款方式，提示
      isShowModalBySelectPayment: false,
      showModalByPaymentPaymentMoney: 0,
      isShowAutoPayButton: false,

      //获取【付款方式】错误，提示
      isShowModalBySelectPaymentError: false,
      getPaymentErrorFaildOrderList: [],
      getPaymentErrorNotWaitPayIds: [],
      getPaymentErrorPayChannelsList: [],

      //获取手动支付，【付款链接】错误，提示
      isShowModalByPayUrlError: false,
      getPayUrlErrorFaildOrderList: [],
      getPayUrlErrorPayChannelsList: [],
      isShowModalByPayUrl: false,


      //自动代扣失败，提示
      isShowModalByAutoPaymentError: false,
      //自动代扣成功，提示
      isShowModalByAutoPaymentSuccess: false,
      autoPaymentSuccessPayingOrderIds: [],
      autoPaymentSuccessNotWaitPayIds: [],
      autoPaymentSuccessFaildOrderIds: [],

      //取消订单跳转后，弹出确认是否需要刷新数据
      isShowModalByCancelExamine: false,

      //点击待付款时，检查是否开通了代扣，但是开关没开启
      //isShowModalByOpenUpAndNotOpen:false,

      onlineSendErrorMessage: "",//发货失败，查看失败的结果

      //-----------以下是加载列表参数---------------
      page: 1,
      pageSize: 15,
      totalRecord: 0,
      isRefreshing: false,
      showLoading: true,
      refreshText: '↓ 下拉刷新',
      renderFooterText: '加载更多内容',
      refundType: "",
      isShowSearchWarn: false

    };
    //-------------以下是列表加载方法------------------
    this.onRefresh = this.onRefresh.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.onLoadMore = this.onLoadMore.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.renderFooter = this.renderFooter.bind(this);

    this.loadShopList = this.loadShopList.bind(this);
    //this.requestProxy = this.requestProxy.bind(this);

  }

  componentDidMount() {//组件挂载到DOM渲染后被执行，只会执行一次。

    peizhi.requestsLogAsync('to_procurementOrder')
    this.loadShopList();
    //console.log("componentDidMount组件渲染完毕")

    this.getNotice();//获取通知消息

    //监听，规格映射后，页面异步处理数据
    RAP.on('app.indexSelectShopId', (data) => {
      var shopId = data.ShopId;

      var indesx = data.Indexs;
      var tavList = this.state.dataNavs;
      for (let i = 0; i < tavList.length; i++) {
        if (tavList[i].Index == indesx)
          tavList[i].IsSelect = true;
        else
          tavList[i].IsSelect = false;

        tavList[i].Num = "";
      }
      this.setState({ selectShopId: shopId, indexs: indesx, dataNavs: tavList });


      this.onClickShop(shopId);
      //console.log("app.indexSelectShopId:"+JSON.stringify(data));
      //RAP.toast.show("app.indexSelectShopId:"+JSON.stringify(data));
    })
  }

  loadShopList() {
    this.setState({  //加载动画
      myShowLoading: true
    })

    var selectId = 0;
    RAP.localStorage.getItem(['indexShopId']).then((result) => {
      if (result.data.indexShopId != undefined) {
        selectId = result.data.indexShopId;
      };
      RAP.localStorage.removeItem(['indexShopId']);
    })

    RAP.localStorage.getItem(['indexStutsIndex']).then((result) => {
      if (result.data.indexStutsIndex != undefined) {
        var indesx = result.data.indexStutsIndex;
        var tavList = this.state.dataNavs;
        for (let i = 0; i < tavList.length; i++) {
          if (tavList[i].Index == indesx)
            tavList[i].IsSelect = true;
          else
            tavList[i].IsSelect = false;

          tavList[i].Num = "";
        }
        this.setState({ indexs: indesx, dataNavs: tavList });
      };
      RAP.localStorage.removeItem(['indexStutsIndex']);
    })


    var that = this;
    peizhi.proxyRequest({
      url: "/MyShop/List",
      data: {},
      success: (res) => {
        var shopid = 0;
        var shopName = "";
        var shopPlatformType = "";
        if (res.Success) {
          var list = res.Data.DataList.Shops;
          if (list != null && list.length > 0) {
            for (var i = 0; i < list.length; i++) {

              if (selectId > 0 && selectId == list[i].Id) {
                list[i].IsSelected = true;
                shopid = list[i].Id;
                shopName = list[i].ShopName;
                shopPlatformType = list[i].PlatformType;
              }
              else if (i == 0 && selectId == 0) {
                list[i].IsSelected = true;
                shopid = list[i].Id;
                shopName = list[i].ShopName;
                shopPlatformType = list[i].PlatformType;
              }
              else
                list[i].IsSelected = false;
            }
          }

          if (shopid == 0) {
            //关闭动画
            this.setState({ myShowLoading: false, showLoading: false, ownerShopUidToken: res.Data.OwnerShopUidToken });
          } 
          else 
          {
            var selectShopList = [];
            selectShopList.push(shopid);
            let selectTitle = peizhi.forMatSelectTitle(list, selectShopList);  //格式化店铺标题
            this.setState({
              shopList: list,
              selectShopId: shopid,
              selectTitle: selectTitle,
              selectShopName: shopName,
              selectShopPlatformType: shopPlatformType,
              ownerShopUidToken: res.Data.OwnerShopUidToken,
            });
            setTimeout(() => {
              this.requestProxy(that.state.indexs, 0);
            }, 500);

            //初始化时，触发一次同步订单，获取订单列表是会同步，目前如果是授权过期了，就不会触发到同步
            //或者如果关联的店铺已经过期了，但是没触发到同步，授权过期的信息就显示不正确导致用户操作了发货等操作
            var shopIdList=[];
            for (let i = 0; i < list.length; i++) {
                shopIdList.push(list[i].Id);
            }
            peizhi.proxyRequest({
              url: "/Order/TriggerSync",
              data: {SyncSids: shopIdList},
              success: (res) => {}
            });

            
          }


        } else {
          that.setState({  //加载动画
            myShowLoading: false
          })
          RAP.toast.show("获取店铺错误:" + res.Message);
        }
      },
      fail: function (error) {
        that.setState({  //加载动画
          myShowLoading: false
        })

      }
    });

    

    //获取开通自动代扣的链接
    peizhi.proxyRequest({
      url: "/Common/GetOpenAutoWithholdUrl",
      data: {},
      success: (res) => {
        that.setState({ myShowLoading: false });
        if (res.Success) {
          that.setState({ openUrl: res.Data.OpenUrl });
        } else
          RAP.toast.show("获取开通链接错误:" + res.Message, RAP.toast.LONG);
      },
      fail: function (error) {
      }
    });


  }


  //店铺列表（完整的列表数据），
  loadShopListByFull=(isLoadOrderList)=>{
    var that=this;
   
    peizhi.proxyRequest({
      url: "/MyShop/List",
      data: {},
      success: (res) => {
        if (res.Success) {
          var listData = res.Data.DataList.Shops;
          if(listData ==null || listData ==undefined)
            listData=[];

          var shopList=that.state.shopList;
          for (let i = 0; i < listData.length; i++) {
            for (let j = 0; j < shopList.length; j++) {
              if(listData[i].Id == shopList[j].Id)
              {
                shopList[j].AuthUrl=listData[i].AuthUrl;
                shopList[j].PayUrl=listData[i].PayUrl;
              }
            }
          }

          that.setState({shopList:shopList},()=>{
            var isAuth= that.shopIsAuthEnd();
            if(isAuth && that.state.isShowAuth !=true)
                that.setState({isShowAuth:true});
            else if(isLoadOrderList ==true){
              this.requestProxy(that.state.indexs, 0);
            }
              //app.MessageShow('error', "检测到当前选择的店铺，授权已过期，请去店铺列表操作！");
          });
        } 
      },
      fail: function (error) {
       
      }
    });
  }

  //店铺是否授权过期。
  shopIsAuthEnd=()=>{
    var isAuth=false;
    var shopid = this.state.selectShopId;
    if(peizhi.isNotNull(shopid) && shopid !=0)
     {
       var shopList=this.state.shopList;
       for (let i = 0; i < shopList.length; i++) {
        if(shopid  ==shopList[i].Id)
        {
           var shop=shopList[i];
           if(shop.PlatformType !="KuaiShou" && (shop.AuthUrl !="" || shop.PayUrl !=""))
             isAuth= true;

           if(shop.PlatformType =="KuaiShou" && (shop.AuthUrlOrder !="" || shop.PayUrlOrder !=""))
             isAuth= true;
         }
       }
     }

     return isAuth;
  }




  //选项卡，内容初始化typeNumber=0/追加内容typeNumber=1/下拉刷新typeNumber=2
  loadOrderFun(indexs, typeNumber) {
    if (typeNumber == 1) {
      this.setState({
        page: this.state.page + 1,
        refreshingData: []
      });
    } else if (typeNumber == 0) {
      this.setState({
        purchaseOrderList: [],
        selectPurchaseOrderList: [],
        selectOrderList: [],
        page: 1,
        refreshingData: [],
        showLoading: false,
        noneData: false,
        renderFooterText: '加载更多内容'
      });
    }

    this.requestProxy(indexs, typeNumber);
  }

  copyText = (value) => {

    RAP.clipboard.setString(value);
    RAP.toast.show('复制成功');
  }

  requestProxy(indexs, typeNumber) 
  {
    RAP.off('app.notCategoryByOrderList');//卸掉监听
    if (this.state.selectShopId == 0) {
      RAP.toast.show("请选择店铺！");
      return;
    }

    if (typeNumber == 0 || typeNumber == 2) {
      //触发一次，获取是否授权过期或者是授权了不授权
      setTimeout(() => {
        this.loadShopListByFull();
      }, 1000);

      var isAuth=this.shopIsAuthEnd();
      if(isAuth==true){
        this.setState({ myShowLoading: false,showLoading:false,isAuthShop:true,isRefreshing: false,refreshText: '↓ 下拉刷新',purchaseOrderList:[]});
        return;
      }
      
    }
    

    if (typeNumber == 0) {
      this.setState({  //加载动画
        myShowLoading: true,
        showLoadingTitle: '加载中',
      })
    }
    this.setState({ syncOrderBySelectOrderStatus: '' ,isAuthShop:false});


    var obj = this.loadOrderData(indexs);

    var that = this;
    peizhi.proxyRequest({
      url: "/PurchaseOrder/List",
      data: obj,
      isPinduoduoCloud: that.state.selectShopPlatformType.toLowerCase() == "pinduoduo" ? true : false,
      isJingDongCloud: that.state.selectShopPlatformType.toLowerCase() == "jingdong" ? true : false,
      ownerShopUidToken: that.state.ownerShopUidToken,
      success: (res) => {
        that.refs.scrollerList.resetLoadmore();//清除 官方组件 上拉加载更多的 标记
        that.setState({ myShowLoading: false });//关闭动画
        //console.log("PurchaseOrder/List res:" + JSON.stringify(res))
        if (typeNumber == 2) {
          that.setState({
            isRefreshing: false,
            refreshText: '↓ 下拉刷新',
          });
        }


        // that.setState({linshiRes:"linshiRes: "+JSON.stringify(res)});
        if (res.Success) {

          var resultList = res.Data.Orders;
          var totalRecord = res.Data.TotalCount;


          var rownumber = false;
          var noneData = false;

          for (let i = 0; i < resultList.length; i++) {
            rownumber = true;
            resultList[i].IsChange = false;
            resultList[i].IsMore = true;

            if (typeNumber == 2) {
              this.state.refreshingData.push(resultList[i]);
            } else {
              this.state.purchaseOrderList.push(resultList[i]);
            }
          }

          var dangqianNumber = this.state.page * this.state.pageSize;

          //订单状态对应的数量
          that.tabheaderNumber(indexs, totalRecord);

          if (totalRecord == 0)
            noneData = true;
          else if (dangqianNumber >= totalRecord)
            that.setState({ renderFooterText: '----底部----', });


          if (typeNumber == 2 && rownumber) {
            that.setState({
              purchaseOrderList: that.state.refreshingData,
              totalRecord: totalRecord,
              showLoading: true,
              noneData: noneData,
              isDaoJiShi: true,
              isAllChange: false,//追加到数据时，全选关闭
            });
          } else {
            if (rownumber) {
              var isAllChange = that.state.isAllChange;
              if (typeNumber == 0)
                isAllChange = false;

              that.setState({
                purchaseOrderList: that.state.purchaseOrderList,
                totalRecord: totalRecord,
                showLoading: true,
                noneData: noneData,
                isAllChange: isAllChange,//追加到数据时，全选关闭
              });
              if (typeNumber == 1 && isAllChange == true)//追加的时候，如果是全选的情况下，就追加
              {
                setTimeout(() => {
                  that.allChange(true);
                }, 300);
              }
            } else {
              that.setState({
                noneData: noneData,
                showLoading: !noneData,//如果显示没有数据（noneData=true）的图片，那底部就不显示【--底部--】
                renderFooterText: '----底部----',
              });
              if (noneData)//补充下拉时，订单总数为0的，就需要清掉页面订单显示
                that.setState({ purchaseOrderList: [] });
            }
          }


        } else
          RAP.toast.show("【请重新下拉获取】获取订单失败:" + res.Message, RAP.toast.LONG);


      },
      fail: function (error) {
        that.setState({
          isRefreshing: false,
          refreshText: '↓ 下拉刷新',
          myShowLoading: false,
        });
        that.refs.scrollerList.resetLoadmore();//清除 官方组件 上拉加载更多的 标记
      }
    });
  }

  loadOrderData(indexs) {
    let obj = {};
    obj.ShopId = this.state.selectShopId;

    var syncOrderStatus = this.state.syncOrderBySelectOrderStatus;
    if (syncOrderStatus != "") {
      obj.OrderStatus = syncOrderStatus;
    }
    else if (indexs == 0)//待确认
    {
      //obj.PurchaseOrderStatus = "waitpurchase";
      obj.OrderStatus = "waitpurchase";
    } else if (indexs == 1)//待付款
    {
      //obj.PurchaseOrderStatus = "waitbuyerpay";
      obj.OrderStatus = "waitbuyerpay";
    } else if (indexs == 2)//待发货
    {
      //obj.PurchaseOrderStatus = "waitsellersend";
      obj.OrderStatus = "waitsellersend";
    } else if (indexs == 3)//已发货
    {
      //obj.PurchaseOrderStatus = "";
      obj.OrderStatus = "waitbuyerreceive";
    } else if (indexs == 4)//交易完成
    {
      //obj.PurchaseOrderStatus = "";
      obj.OrderStatus = "success";
    } else if (indexs == 5)//交易关闭
    {
      
      if(this.state.refundType =="noRefund")
        obj.OrderStatus = "purchase_no_refund";
      else if(this.state.refundType =="refund")
         obj.OrderStatus = "purchase_refund";
      else 
        obj.OrderStatus = "cancel";

    } else if (indexs == 6)//退款中
    {
      //obj.PurchaseOrderStatus = "";
      obj.OrderStatus = "wait_seller_agree";
      //obj.RefundStatus = "WAIT_SELLER_AGREE";
    } else if (indexs == 7)//忽略订单
    {
      obj.OrderStatus = "ignore";
    }



    var dayas = "7";
    var chooseDate = this.state.chooseDate;//天数
    for (let i = 0; i < chooseDate.length; i++) {
      if (chooseDate[i].isSelect == true)
        dayas = chooseDate[i].value;
    }
    var chooseOrderShowTypes = this.state.chooseOrderShowTypes;//排序
    var orderBy = "";
    for (let i = 0; i < chooseOrderShowTypes.length; i++) {
      if (chooseOrderShowTypes[i].isSelect == true) {
        if (chooseOrderShowTypes[i].value == "0")
          orderBy = "desc";
        else
          orderBy = "asc";
      }
    }
    var orderId = this.state.orderIdInputValue;
    if (orderId != "" && orderId != undefined)
      obj.PurchaseOrderStatus = "";

    //chooseOrderTypes: [{ name: "订单编号", value: "", isSelect: false }, { name: "采购编号", value: "", isSelect: true }],
    //chooseOrderTypeValue: "",//input框内容

    obj.Days = dayas;
    obj.OrderBy = orderBy;
    obj.PlatformOrderId = orderId;
    obj.PageIndex = this.state.page;
    obj.PageSize = this.state.pageSize;
    obj.PlatformType = this.state.selectShopPlatformType;

    return obj;
  }

  //订单状态对应的数量
  tabheaderNumber(index, allnumber) {

    var shows = [];
    if (index == 0)
      shows = ['待确认' + allnumber, '待付款', '待发货', '已发货', '交易完成', '交易关闭', '退款中', '忽略订单'];
    else if (index == 1)
      shows = ['待确认', '待付款' + allnumber, '待发货', '已发货', '交易完成', '交易关闭', '退款中', '忽略订单'];
    else if (index == 2)
      shows = ['待确认', '待付款', '待发货' + allnumber, '已发货', '交易完成', '交易关闭', '退款中', '忽略订单'];
    else if (index == 3)
      shows = ['待确认', '待付款', '待发货', '已发货' + allnumber, '交易完成', '交易关闭', '退款中', '忽略订单'];
    else if (index == 4)
      shows = ['待确认', '待付款', '待发货', '已发货', '交易完成' + allnumber, '交易关闭', '退款中', '忽略订单'];
    else if (index == 5)
      shows = ['待确认', '待付款', '待发货', '已发货', '交易完成', '交易关闭' + allnumber, '退款中', '忽略订单'];
    else if (index == 6)
      shows = ['待确认', '待付款', '待发货', '已发货', '交易完成', '交易关闭', '退款中' + allnumber, '忽略订单'];
    else if (index == 7)
      shows = ['待确认', '待付款', '待发货', '已发货', '交易完成', '交易关闭', '退款中', '忽略订单'+ allnumber];

    //新
    var dataNavs = this.state.dataNavs;
    dataNavs[index].Num = allnumber;


    this.setState({
      dataSource: shows,
      dataNavs: dataNavs
    });

  }


  getNotice = () => {   //获取通知
    var that = this;
    peizhi.proxyRequest({
      url: "/Common/TopNoticeByOrder",
      data: {},
      success: (res) => {
        if (res.Success) {
          let relustData = res.Data;
          that.setState({
            noticeContent: relustData.NoticeContent
          })
          if (relustData.NoticeUrl) {
            that.setState({
              noticeUrl: encodeURI(relustData.NoticeUrl)
            })
          }
        }
      },
      fail: function (error) {
      }
    });


  }



  // //选择店铺
  // handleSelectShop = (index, item) => {
  //   var shopList = this.state.shopList;
  //   var selectPlatformType = 'Taobao';
  //   for (var i = 0; i < shopList.length; i++) {
  //     if (shopList[i].Id == index) {
  //       selectPlatformType = shopList[i].PlatformType;
  //     }
  //   }

  //   this.setState({
  //     selectShopId: index,
  //     selectPlatformType: selectPlatformType
  //   });

  //   this.loadOrderFun(this.state.indexs, 0);
  // };

  //---------------------------------------------上拉，下拉控件事件---------------------------------------------------------

  //列表顶部  --显示字样
  renderHeader() {
    return (
      <RefreshControl
        style={styles.refresh}
        refreshing={this.state.isRefreshing}
        onRefresh={this.onRefresh}
      >
        <View className="renderHeaderWrap">
          <Text className="renderHeader">{this.state.refreshText}</Text>
        </View>
      </RefreshControl>
    );
  }

  //列表底部--显示字样
  renderFooter() {
    return (
      <View>
        {this.state.showLoading ? (
          <View className="renderFooter">
            {
              this.state.renderFooterText != "----底部----" ?
                <Image style={{ width: 25, height: 25, marginRight: "3rem" }} src="https://dgjapp.com/public/images/zhipoIcon/timg02.gif" />
                : null
            }

            <Text className="renderFooterText">{this.state.renderFooterText}</Text>
            <View style={{ height: 130 }}></View>
          </View>

        ) : null}
      </View>
    )
  }


  //下拉刷新
  onRefresh(e) {

    this.setState({
      isRefreshing: true,
      refreshText: '加载中',
      refreshingData: [],
      page: 1,
      noneData: false,
      renderFooterText: '加载更多内容',
      selectOrderList: [],
      selectPurchaseOrderList: [],
      isAllChange: false,
      isShowBatch: false,
    });


    this.requestProxy(this.state.indexs, 2);
    setTimeout(() => {

    }, 100);

  }

  //上拉到底部【触发】
  onLoadMore() {
    //this.refs.scrollerList.resetLoadmore();//清除 官方组件 上拉加载更多的 标记

    //RAP.toast.show("onLoadMore");
    var text = this.state.renderFooterText;
    if (text != "----底部----")
      this.loadOrderFun(this.state.indexs, 1);
  }
  moreProducts = (PlatformOrderId) => {
    let purchaseOrderList = this.state.purchaseOrderList;
    for (let i = 0; i < purchaseOrderList.length; i++) {
      if (purchaseOrderList[i].SellerOrder.PlatformOrderId == PlatformOrderId) {
        purchaseOrderList[i].IsMore = !purchaseOrderList[i].IsMore;
      }
    }
    this.setState({
      purchaseOrderList: purchaseOrderList
    })

  }

  //---------------------------------------------上拉，下拉控件事件  end---------------------------------------------------------


  //列表显示内容
  renderItem(item) {

    return (
      // <View>
      //    <View>
      //     {
      //       this.state.isShowBatch?<Checkbox size="small" />:null
      //     }
      //       <Text >付款时间：{item.SellerOrder.PlatformOrderId}</Text>
      //       <Text >付款时间：{item.SellerOrder.PayTime}</Text>
      //    </View>

      //    {/* 循环，超过两行，出现下拉 */}
      //    <View>

      //    {
      //      item.SellerOrder.OrderItems.map((itemSku)=>
      //      <View>
      //        <Image src={itemSku.ProductImgUrl} style={{ width: '300rem', height: '300rem', marginBottom: '20rem' }} />
      //        {itemSku.IsFenXiao==true?<View>分销</View>:<View>未分销</View>}

      //        <View>{itemSku.ProductSubject}</View>
      //        <View>{itemSku.Color}{itemSku.Size}</View>
      //        <View>X{itemSku.Count}</View>

      //        <View>{itemSku.ItemAmount}</View>

      //      </View>
      //      )
      //    }

      //    </View>

      //    <View>{item.SellerOrder.ProductCount}种商品共计{item.SellerOrder.ProductItemCount}件  
      //    已付款:(含运费:￥{item.SellerOrder.ShippingFee})￥{item.SellerOrder.TotalAmount}</View>

      //    <View>
      //       <View>收件人:</View>
      //       <View>收件地址:</View>
      //    </View>

      //    {/* 供应商列表。只显示两行，其他的隐藏，会出现【展开】按钮，前期默认显示一行来做效果 */}

      //    {
      //      item.BuyerOrders.map((supplierItem)=>
      //        <View>
      //         <View>供应商:{supplierItem.SupplierLoginId}</View>
      //         <View>采购订单:{supplierItem.BuyerOrder}</View>
      //        </View>
      //      )
      //    }

      //     {/* 前期默认显示一行来做效果  length>=1 */}
      //    <View>
      //      {
      //        item.BuyerOrders.length>=1?
      //        <Button>展开</Button>:null
      //      }

      //      <Button>查看详情</Button>
      //      {
      //        this.state.indexs==0?
      //        <Button onPress={()=>this.confirmOrder(item.SellerOrder.Id)}>确认采购单</Button>:null
      //      }
      //    </View>
      // </View>

      <View className="procurementWrap">
        <View className="commonList02">
          <View className="commonList02-left">
            {this.state.isShowBatch ? <Checkbox checked={item.IsChange} size="small" onChange={(value) => this.orderChange(value, item.SellerOrder.OrderCode)} /> : null}
            <Text className="commonList-text02 fS10">{item.SellerOrder.PlatformOrderId}</Text>
            <Icon className="iconfont icon-fuzhi commonList-text02" name="order_list-o" onClick={() => this.copyText(item.SellerOrder.PlatformOrderId)}></Icon>
          </View>
          <View className="commonList02-right">
            <Text className="commonList-text02 fS10">付款时间:</Text><Text className="commonList-text02 fS10" style={{ lineHeight: "28rem" }}>{item.SellerOrder.PayTime}</Text>
          </View>
        </View>
        <View className="productWrap" style={{ width: "714rem", marginTop: 0 }}>

          {
            item.IsMore ?
              item.SellerOrder.OrderItems.slice(0, 2).map((itemSku) =>
                <View className="productWrap-show" style={{ width: '700rem', borderBottom: "none" }}>
                  <View className="productWrap-show-left">
                    <Image className="productWrap-left-img" src={itemSku.ProductImgUrl} />
                    {itemSku.IsFenXiao == false ? <Text className="platform-Status" style={{ backgroundColor: "#f7941f" }}>未分销</Text> : null}
                    {
                      itemSku.IsFenXiao == true && itemSku.RefundStatus != "" && itemSku.RefundStatus != null && itemSku.RefundStatus != "REFUND_SUCCESS" ? <Text className="platform-Status" style={{ backgroundColor: "#fe6f4f" }}>退款中</Text> : null
                    }
                    {
                      itemSku.IsFenXiao == true && itemSku.RefundStatus != "" && itemSku.RefundStatus != null && itemSku.RefundStatus == "REFUND_SUCCESS" ? <Text className="platform-Status" style={{ backgroundColor: "#fe6f4f" }}>退款完成</Text> : null
                    }
                    {
                      itemSku.IsFenXiao == true && (itemSku.RefundStatus == "" || itemSku.RefundStatus == null) && itemSku.Status == "waitbuyerreceive" ? <Text className="platform-Status" style={{ backgroundColor: "#3aadff" }}>已发货</Text> : null
                    }
                  </View>
                  <View className="productWrap-show-right" style={{ justifyContent: "flex-start", position: "relative" }}>
                    <View className="productWrap-right-PartTwo mB6">
                      <Text className="fS12 productWrap-right-text" style={{ width: "480rem" }}>
                        {itemSku.ProductSubject.length>17?itemSku.ProductSubject.substring(0,17)+"...":itemSku.ProductSubject}
                      </Text>
                    </View>
                    <View className="productWrap-right-PartFive mB6">
                      <Text className="fS10 errorColor mB15">￥{itemSku.ItemAmount}</Text>
                      <Text className="fS10 errorColor">x{itemSku.Count}</Text>
                    </View>
                    <View className="productWrap-right-PartThree mB6">
                      <Text className="fS11 productWrap-right-text02" style={{ color: "#fa9500" }}>{itemSku.Color}{itemSku.Size}</Text>
                      {
                        itemSku.IsFenXiao == true && itemSku.IsMapping == false ?
                          <Text className="productWrap-right-text03">规格未匹配</Text>
                          : null
                      }
                      {
                        itemSku.IsFenXiao == true && itemSku.IsSendFaild == true ?
                          <Text className="productWrap-right-text03" style={{ backgroundColor: "#fe6f4f", color: "#fffefe", width: "300rem" }} onClick={() => this.onlineSendErrorMsg(item.SellerOrder.PlatformOrderId, itemSku.OrderItemCode)}>自动发货失败，点击查看详情</Text>
                          : null
                      }
                    </View>
                  </View>
                </View>)
              :
              item.SellerOrder.OrderItems.map((itemSku) =>
                <View className="productWrap-show" style={{ width: '700rem', borderBottom: "none" }}>
                  <View className="productWrap-show-left">
                    <Image className="productWrap-left-img" src={itemSku.ProductImgUrl} />
                    {itemSku.IsFenXiao == false ? <Text className="platform-Status" style={{ backgroundColor: "#f7941f" }}>未分销</Text> : null}
                    {
                      itemSku.IsFenXiao == true && itemSku.RefundStatus != "" && itemSku.RefundStatus != null && itemSku.RefundStatus != "REFUND_SUCCESS" ? <Text className="platform-Status" style={{ backgroundColor: "#fe6f4f" }}>退款中</Text> : null
                    }
                    {
                      itemSku.IsFenXiao == true && itemSku.RefundStatus != "" && itemSku.RefundStatus != null && itemSku.RefundStatus == "REFUND_SUCCESS" ? <Text className="platform-Status" style={{ backgroundColor: "#fe6f4f" }}>退款完成</Text> : null
                    }
                    {
                      itemSku.IsFenXiao == true && (itemSku.RefundStatus == "" || itemSku.RefundStatus == null) && itemSku.Status == "waitbuyerreceive" ? <Text className="platform-Status" style={{ backgroundColor: "#3aadff" }}>已发货</Text> : null
                    }
                  </View>
                  <View className="productWrap-show-right" style={{ justifyContent: "flex-start", position: "relative" }}>
                    <View className="productWrap-right-PartTwo">
                      <Text className="fS12 productWrap-right-text" style={{ width: "500rem" }}>{itemSku.ProductSubject}</Text>
                    </View>
                    <View className="productWrap-right-PartFive">
                      <Text className="fS10 errorColor mB15">￥{itemSku.ItemAmount}</Text>
                      <Text className="fS10 errorColor">x{itemSku.Count}</Text>
                    </View>
                    <View className="productWrap-right-PartThree">
                      <Text className="fS10 productWrap-right-text02" style={{ color: "#fa9500" }}>{itemSku.Color}{itemSku.Size}</Text>
                      {
                        itemSku.IsFenXiao == true && itemSku.IsMapping == false ?
                          <Text className="productWrap-right-text03">规格未匹配</Text>
                          : null
                      }
                      {
                        itemSku.IsFenXiao == true && itemSku.IsSendFaild == true ?
                          <Text className="productWrap-right-text03" style={{ backgroundColor: "#fe6f4f", color: "#fffefe", width: "300rem" }} onClick={() => this.onlineSendErrorMsg(item.SellerOrder.PlatformOrderId, itemSku.OrderItemCode)}>自动发货失败，点击查看详情</Text>
                          : null
                      }
                    </View>
                  </View>
                </View>)
          }
        </View>
        {
          item.SellerOrder.OrderItems.length > 2 ?
            item.IsMore ?
              <View className="moreOperate-wrap" style={{ marginTop: "-2rem" }}>
                <View className="moreOperate" onClick={() => this.moreProducts(item.SellerOrder.PlatformOrderId)} style={{ paddingLeft: "10rem", paddingRight: "10rem", borderColor: "#f7941f" }}>
                  <Text className="mainColor" style={{ color: "#f7941f" }}>更多商品</Text>
                  <Icon className="mainColor" name="menu_down" style={{ color: "#f7941f" }}></Icon>
                </View>
              </View> : <View className="moreOperate-wrap" style={{ marginTop: "-2rem" }}>
                <View className="moreOperate" onClick={() => this.moreProducts(item.SellerOrder.PlatformOrderId)} style={{ paddingLeft: "10rem", paddingRight: "10rem", }}>
                  <Text className="mainColor">收起商品</Text>
                  <Icon className="mainColor" name="menu_up"></Icon>
                </View>
              </View> : null
        }

        <View className="commonList02">
          <View className="commonList02-left"></View>
          <View className="commonList02-right">
            <Text className="commonList-text02">{item.SellerOrder.ProductCount}种商品共计{item.SellerOrder.ProductItemCount}件 已付款:(含运费:￥{item.SellerOrder.ShippingFee})</Text><Text className="errorColor">￥{item.SellerOrder.TotalAmount}</Text>
          </View>
        </View>
        <View className="commonList02" style={{ borderBottom: "unset", paddingBottom: "0" }}>
          <View className="commonList02-left">
            <Text className="commonList02-left-title">收 货 人 : </Text>
            <Text className="commonList02-left-content">{item.SellerOrder.ToName} </Text>

            <Text className="commonList02-left-content">{item.SellerOrder.ToMobile} </Text>

          </View>
        </View>
        <View className="commonList02">
          <View className="commonList02-left" style={{ flex: 1 }}>
            <Text className="commonList02-left-title">收货地址:</Text>
            <Text className="commonList02-left-content">{item.SellerOrder.ToFullAddress}</Text>
            <Icon className="iconfont icon-fuzhi commonList-text02" name="order_list-o" onClick={() => this.copyText(item.SellerOrder.ToName + " " + item.SellerOrder.ToMobile + " " + item.SellerOrder.ToFullAddress)}></Icon>
          </View>
        </View>

        {
          item.BuyerOrders.map((supplierItem) =>

            <View className="commonList03">
              <View className="commonList02">
                <View className="commonList02-left">
                  <Text className="commonList02-left-title">供 应 商 :</Text>
                  <Text className="commonList02-left-content">{supplierItem.SupplierLoginId}</Text>
                  <Icon className="commonList02-left-content iconfont icon-wangwang mainColor" name="wangwang" onClick={() => this.toWangWang(supplierItem.SupplierLoginId)}></Icon>
                </View>
              </View>
              <View className="commonList02">
                <View className="commonList02-left" style={{ flex: 1 }}>
                  <Text className="commonList02-left-title">采购单号:</Text>
                  <View className="payTypeWrap">
                    <Text className="commonList02-left-content">
                      {supplierItem.BuyerOrder == null
                        || (supplierItem.BuyerOrder != null && (supplierItem.BuyerOrder.PlatformOrderId == ""
                          || supplierItem.BuyerOrder.PlatformOrderId == null))
                        ? "确认后生成"
                        : supplierItem.BuyerOrder.PlatformOrderId
                      }
                    </Text>


                    {
                      supplierItem.BuyerOrder != null && supplierItem.BuyerOrder.ExtField1 == "Paying" ?
                        <Text className="payTypeStatus">免密支付中</Text>
                        : null
                    }
                    {
                      supplierItem.BuyerOrder != null && supplierItem.BuyerOrder.ExtField1 == "Faild" ?
                        <Text className="payTypeStatus" style={{ backgroundColor: "#fe6f4f" }}>免密支付失败，请手动支付</Text>
                        : null
                    }

                    {
                      supplierItem.BuyerOrder != null && supplierItem.BuyerOrder.TradeType == "Alipay" && supplierItem.BuyerOrder.ExtField1 == "Success" ?
                        <Text className="payTypeStatus">支付宝</Text>
                        : null
                    }

                    {
                      supplierItem.BuyerOrder != null && supplierItem.BuyerOrder.TradeType == "Epay" && supplierItem.BuyerOrder.ExtField1 == "Success" ?
                        <Text className="payTypeStatus">诚E赊</Text>
                        : null
                    }
                  </View>


                </View>
              </View>
            </View>
          )
        }
        <View className="commonList02" style={{ height: 90,borderColor:"#fff" }}>
          <View className="commonList02-left">
          </View>
          <View className="commonList02-right">
            <Text className="operateMainBtn04" onPress={() => this.procurementDetails(item.SellerOrder.PlatformOrderId)}>查看详情</Text>
            {
              this.state.indexs == 1 ?
                <Text className="operateMainBtn02 mL15" onPress={() => this.orderPayment(item.SellerOrder.OrderCode)}>向供应商付款</Text>
                : null
            }

            {
              this.state.indexs == 0 ?
                <Text className="operateMainBtn02 mL15"   onPress={() => this.ignoreOrder(item.SellerOrder.OrderCode,1)}>忽略订单</Text>
                : null
            }
            {
              this.state.indexs == 7 ?
                <Text className="operateMainBtn02 mL15" style={{backgroundColor: "#3aadff",color:"#ffffff"}} onPress={() => this.ignoreOrder(item.SellerOrder.OrderCode,0)}>取消忽略</Text>
                : null
            }

            {
              this.state.indexs == 0 ?
                <Text className="operateMainBtn02 mL15" style={{backgroundColor: "#3aadff",color:"#ffffff"}} onPress={() => this.confirmOrder(item.SellerOrder.OrderCode)}>确认采购单</Text>
                : null
            }

            

          </View>
        </View>
      </View>




    );
  }

  //批量开启后，取消的
  batchCancel = () => {
    this.allChange(false);

    this.setState({
      selectOrderList: [],
      selectPurchaseOrderList: [],
      isShowModalBynotCategory: false,
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
      isShowBatch: false,
    })


  }


  //查看发货错误情况
  onlineSendErrorMsg = (platformOrderId, orderItemCode) => {

    var data = {
      ShopId: this.state.selectShopId,
      SalesOrderCode: platformOrderId,
      SalesOrderItemCode: orderItemCode
    };
    var that = this;

    this.setState({ myShowLoading: true, showLoadingTitle: '加载中...' });

    peizhi.proxyRequest({
      url: "/PurchaseOrder/GetOnlineSendErrorMsg",
      data: data,
      success: (res) => {
        that.setState({ myShowLoading: false });
        if (res.Success) {
          var message = res.Data.ErrorMessage

          that.setState({ onlineSendErrorMessage: message });
          that.refs.onlineSendErrorMsgRef.show();
        } else
          RAP.toast.show("获取开通链接错误:" + res.Message, RAP.toast.LONG);
      },
      fail: function (error) {
      }
    });

  }

  //确认采购订单--按钮
  confirmOrder = (orderCode) => {

    if (this.state.myShowLoading) {
      RAP.toast.show("请勿重复提交！");
      return;
    }
    this.setState({ myShowLoading: true, showLoadingTitle: '处理中' });

    var orderList = this.state.purchaseOrderList;
    var selectOrderList = [];
    if (orderCode == null || orderCode == undefined || orderCode == "")
      selectOrderList = this.state.selectOrderList;
    else
      selectOrderList.push(orderCode);


    if (selectOrderList.length == 0) {
      RAP.toast.show("请选择订单");
      this.setState({ myShowLoading: false });
      return;
    }

    var notCategoryList = [];
    var notCategoryListTitle = "";
    var notCategoryListTitleNumber = 0;
    for (let i = 0; i < orderList.length; i++) {
      for (let j = 0; j < selectOrderList.length; j++) {
        if (orderList[i].SellerOrder.OrderCode == selectOrderList[j]) {
          var orderItemList = orderList[i].SellerOrder.OrderItems;
          for (let k = 0; k < orderItemList.length; k++) {
            if (orderItemList[k].IsFenXiao == true && orderItemList[k].IsMapping == false)//临时注释，为了有数据做跳转，这个验证需要有
            //if(orderItemList[k].IsFenXiao ==true)//临时注释，为了有数据做跳转，这个验证需要有
            {
              var listJson = {
                ProductID: orderItemList[k].ProductID,
                SupplierProductId: orderItemList[k].SupplierProductId,
                SupplierProductCode: orderItemList[k].SupplierProductCode,
              }
              notCategoryList.push({ orderCode: orderList[i].SellerOrder.OrderCode, ListJson: listJson });
              if (notCategoryListTitleNumber == 3)
                notCategoryListTitle += "...";
              if (notCategoryListTitleNumber < 3)
                notCategoryListTitle += orderItemList[k].ProductSubject;

              notCategoryListTitleNumber++;
            }
          }
        }
      }
    }

    if (notCategoryList.length > 0) {
      this.setState({ notCategoryList: notCategoryList, notCategoryListTitle: notCategoryListTitle, isShowModalBynotCategory: true, myShowLoading: false });
      return;
    }

    this.setState({ selectOrderList: selectOrderList });

    setTimeout(() => {
      this.createPurchaseOrder();
    }, 0);
  }


  //向供应商支付 这个orderCode 是卖家code，通过这个code，再找到买家code。用于批量和整个订单
  orderPayment = (orderCode) => {
    //var orderList = this.state.purchaseOrderList;

    if (this.state.myShowLoading) {
      RAP.toast.show("请勿重复提交！");
      return;
    }
    this.setState({ myShowLoading: true, showLoadingTitle: '处理中' });


    var selectOrderList = [];
    if (orderCode == null || orderCode == undefined || orderCode == "")
      selectOrderList = this.state.selectOrderList;
    else
      selectOrderList.push(orderCode);


    if (selectOrderList.length == 0) {
      RAP.toast.show("请选择订单");
      this.setState({ myShowLoading: false });
      return;
    }

    var buyerIdList = this.getListPurchaseOrderCode(selectOrderList, true);

    this.setState({ selectOrderList: selectOrderList, selectPurchaseOrderList: buyerIdList });
    if (buyerIdList.length > 50 && this.state.isRemindThirty) {
      this.setState({ isShowModalByBatchOpen: true, myShowLoading: false });
      return;
    }

    if (buyerIdList.length == 0) {
      RAP.toast.show("选择的订单没有待付款的采购单");
      this.setState({ myShowLoading: false });
      return;
    }

    if (buyerIdList.length > 50) {
      this.protocalPayOpenConfirm(true);
    } else {
      setTimeout(() => {
        this.getOrderPayType();
      }, 0);
    }

  }




  //向供应商支付 这个ordercode是买家的
  orderPaymentByBuyerOrderCode = (orderCode) => {
    var buyerIdList = [];
    buyerIdList.push(orderCode);

    this.setState({ selectPurchaseOrderList: buyerIdList });

    setTimeout(() => {
      this.getOrderPayType();
    }, 0);
  }

  //获取采购单  订单Code数组List
  //isFiltrPany 是否过滤付款
  getListPurchaseOrderCode(selectOrderList, isFiltrPany) {
    var orderList = this.state.purchaseOrderList;

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


  //关闭订单详情页面
  closeProcurementDetails = () => {
    this.setState({
      isShowprocurementDetails: false
    })
  }

  //切换订单状态
  statusTab = (indexs) => {
    this.setState({ indexs: indexs });
    this.loadOrderFun(indexs, 0);

    if (this.state.isShowBatch == true)
      this.changeBatch();//关闭全选

    //this.refs.scrollerList.resetLoadmore();//清除加载更多的标记

    var that = this;
    setTimeout(() => {
      that.openUpAndNotOpenFun();
    }, 1000);

  }

  //导航栏切换(New)
  selectItem = (selectItem) => {
    if (selectItem.Name == "交易关闭") {
      this.setState({
        isShowSearchWarn: true,
        refundType: ""
      })
    } else {
      this.setState({
        isShowSearchWarn: false,
        refundType: ""
      })
    }

    var indexs = selectItem.Index;
    var tavList = this.state.dataNavs;
    for (let i = 0; i < tavList.length; i++) {
      if (tavList[i].Index == indexs)
        tavList[i].IsSelect = true;
      else
        tavList[i].IsSelect = false;

      tavList[i].Num = "";
    }

    this.setState({ indexs: indexs, dataNavs: tavList });
    this.loadOrderFun(indexs, 0);

    if (this.state.isShowBatch == true)
      this.changeBatch();//关闭全选

    var that = this;
    setTimeout(() => {
      that.openUpAndNotOpenFun();
    }, 1000);

    //console.log(JSON.stringify(selectItem))

  }

  //批量显示
  changeBatch = () => {
    var isChange = !this.state.isShowBatch;
    this.setState({
      isShowBatch: isChange
    })


    this.allChange(false);

    //清除数据
    if (isChange == false) {
      this.setState({
        selectOrderList: [],
        selectPurchaseOrderList: [],
        isShowModalBynotCategory: false,
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


  }


  notCategoryByOk = () => {
    //RAP.off('app.notCategoryByOrderList');//卸掉监听
    var lists = this.state.notCategoryList;
    var listJsons = [];
    for (let i = 0; i < lists.length; i++) {
      var jsons = lists[i].ListJson;

      //去重
      var isE = false;
      for (let j = 0; j < listJsons.length; j++) {
        if (jsons.ProductID == listJsons[j].ProductID
          && jsons.SupplierProductCode == listJsons[j].SupplierProductCode)
          isE = true;
      }
      if (isE == false)
        listJsons.push(lists[i].ListJson);
    }
    this.setState({ isShowModalBynotCategory: false });

    var that = this;
    //监听，规格映射后，页面异步处理数据
    RAP.on('app.notCategoryByOrderList', (data) => {
      var productId = data.ProductId;
      var skuMappingList = data.SkuMappingList;
      if (skuMappingList == null || skuMappingList == undefined)
        skuMappingList = [];

      var orderList = that.state.purchaseOrderList;
      for (let i = 0; i < orderList.length; i++) {
        var orderItemList = orderList[i].SellerOrder.OrderItems;
        for (let j = 0; j < orderItemList.length; j++) {
          if (orderItemList[j].ProductID == productId) {
            for (let k = 0; k < skuMappingList.length; k++) {
              if (skuMappingList[k].SkuId == orderItemList[j].SkuID)
                orderItemList[j].IsMapping = true;
            }
          }
        }
        orderList[i].SellerOrder.OrderItems = orderItemList;
      }

      that.setState({ purchaseOrderList: orderList });
    })

    var dataJson = {
      shopid: this.state.selectShopId,
      list: listJsons,
      selectShopPlatformType: this.state.selectShopPlatformType,
      ownerShopUidToken: this.state.ownerShopUidToken
    }
    //跳转
    RAP.navigator.push({
      url: 'rap:///procurementOrderByMap?notcategorylist=' + JSON.stringify(dataJson),  //新开页面 url
      title: '商品映射',
      backgroundColor: '#ffffff', //新开导航栏背景颜色,
    })

  }


  notCategoryByClose = () => {
    this.setState({ isShowModalBynotCategory: false });
  }


  //自动代扣跳转
  autoWithholdLink = () => {
    RAP.navigator.push({
      url: 'rap:///autoWithhold',  //新开页面 url
      title: '自动代扣',
      backgroundColor: '#ffffff', //新开导航栏背景颜色,
    })
  }
   
  //跳转 至店铺列表
  gotoShopList = () => {
    RAP.navigator.push({
      url: 'rap:///myShopList',  //新开页面 url
      title: '店铺列表',
      backgroundColor: '#ffffff', //新开导航栏背景颜色,
    })
    this.setState({isShowAuthSuccess:true,isShowAuth:false});
  }
  //确认是否已授权，触发一次同步，并检查店铺的授权情况
  authConfirmOk = () => {
    var shopList=this.state.shopList;
    var shopIdList=[];
    for (let i = 0; i < shopList.length; i++) {
        shopIdList.push(shopList[i].Id);
    }
 
    if (shopIdList.length > 0) {
      var that=this;
      this.setState({ myShowLoading: true });
      peizhi.proxyRequest({
        url: "/Order/TriggerSync",
        data: {SyncSids: shopIdList},
        success: (res) => {
          that.setState({ myShowLoading: false });
          that.loadShopListByFull(true);
          // console.log("TriggerSync:"+JSON.stringify(res));
        },
        fail: function (error) {
          that.setState({ myShowLoading: false });
        }
      });
    }else
      RAP.toast.show("没有店铺，不做检测同步");

  
    //关闭弹窗
    this.setState({ isShowAuthSuccess: false });
  }



  //单选
  orderChange = (value, orderCode) => {
    var list = this.state.purchaseOrderList;
    var selectOrderList = this.state.selectOrderList;

    var isRefund = false;
    //var isPay=false;
    for (let i = 0; i < list.length; i++) {
      if (list[i].SellerOrder.OrderCode == orderCode) {

        if (list[i].SellerOrder.RefundStatus != null && list[i].SellerOrder.RefundStatus != "") {
          isRefund = true;
          list[i].IsChange = false;
        } else
          list[i].IsChange = value;

        break;
      }
    }

    let isHas = false; //是否已经存在了
    for (let j = 0; j < selectOrderList.length; j++) {
      if (selectOrderList[j] == orderCode) {
        selectOrderList.splice(j, 1);
        isHas = true;  //点之前已经存在了
      }
    }
    if (!isHas && isRefund == false) {//codeId 之前没有存在的，添加进去
      selectOrderList.push(orderCode)
    }

    var buyerIdList = this.getListPurchaseOrderCode(selectOrderList, false);
    if (isRefund)
      RAP.toast.show("选中的商品包含了退款,请到【查看详情】中处理!", RAP.toast.LONG);
    else {
      if (buyerIdList.length > 50)
        RAP.toast.show("已选择超过50条，手动支付会限制。", RAP.toast.LONG);
    }

    setTimeout(() => {
      this.setState({ selectOrderList: selectOrderList, purchaseOrderList: list, selectPurchaseOrderList: buyerIdList });
    }, 0);
  }

  //全选
  allChange = (value) => {
    var selectOrderList = this.state.selectOrderList;
    var list = this.state.purchaseOrderList;
    var isRefundNumber = 0;
    if (!value)  //取消全选  选中的selectOrderList 置空
    {
      selectOrderList = [];
    } else {
      for (let i = 0; i < list.length; i++) {
        //退款的不选中
        if (list[i].SellerOrder.RefundStatus != "" && list[i].SellerOrder.RefundStatus != null)
          isRefundNumber++;
        else
          selectOrderList.push(list[i].SellerOrder.OrderCode);
      }
      selectOrderList = [...new Set(selectOrderList)];//数组去重
    }

    for (let i = 0; i < list.length; i++) {
      //退款的不选中
      if (list[i].SellerOrder.RefundStatus != "" && list[i].SellerOrder.RefundStatus != null)
        list[i].IsChange = false;
      else
        list[i].IsChange = value;
    }
    var titles = "全选的订单中,有" + isRefundNumber + "个订单包含退款，不默认选中，请单选！";
    if (isRefundNumber > 0)
      RAP.toast.show(titles, RAP.toast.LONG);

    var buyerIdList = this.getListPurchaseOrderCode(selectOrderList, false);

    this.setState({ selectOrderList: selectOrderList, purchaseOrderList: list, isAllChange: value, selectPurchaseOrderList: buyerIdList });
  }

  chooseDate = (value) => {
    let chooseDate = this.state.chooseDate;
    for (let i = 0; i < chooseDate.length; i++) {
      if (chooseDate[i].value == value) {
        chooseDate[i].isSelect = true;
      } else {
        chooseDate[i].isSelect = false;
      }
    }
    this.setState({
      chooseDate: chooseDate
    })
  }
  chooseOrderShow = (value) => {
    let chooseOrderShowTypes = this.state.chooseOrderShowTypes;
    for (let i = 0; i < chooseOrderShowTypes.length; i++) {
      if (chooseOrderShowTypes[i].value == value) {
        chooseOrderShowTypes[i].isSelect = true;
      } else {
        chooseOrderShowTypes[i].isSelect = false;
      }
    }
    this.setState({
      chooseOrderShowTypes: chooseOrderShowTypes
    })
  }

  handleSelectOrderType = (value) => {
    this.setState({
      chooseOrderTypeName: value
    })
  }
  changeOrderTypeInput = (event) => {
    let value = event.value;
    let chooseOrderTypes = this.state.chooseOrderTypes;
    let chooseOrderTypeName = this.state.chooseOrderTypeName;
    for (let j = 0; j < chooseOrderTypes.length; j++) {
      if (chooseOrderTypes[j].name == chooseOrderTypeName) {
        chooseOrderTypes[j].value = value;
      }
    }
    this.setState({
      chooseOrderTypes: chooseOrderTypes
    })
  }

  //触发组件  开始搜索按钮
  onClickShop = (selectShopId) => {

    var shopList = this.state.shopList;
    var shopName = "";
    var shopPlatformType = "";
    for (let i = 0; i < shopList.length; i++) {
      if (shopList[i].Id == selectShopId) {
        shopName = shopList[i].ShopName;
        shopPlatformType = shopList[i].PlatformType;
        shopList[i].IsSelected = true;
      } else {
        shopList[i].IsSelected = false;
      }
    }

    this.setState({
      selectShopId: selectShopId,
      selectShopName: shopName,
      shopList: shopList,
      selectShopPlatformType: shopPlatformType,
      selectTitle: shopName.length > 5 ? shopName.substr(0, 4) + '...' : shopName,

    }, () => {
      let obj = {};  //提交的JSON数据
      var chooseDate = this.state.chooseDate;
      var chooseOrderTypes = this.state.chooseOrderTypes;
      var chooseOrderTypeName = this.state.chooseOrderTypeName;
      for (let i = 0; i < chooseDate.length; i++) {
        if (chooseDate[i].isSelect) {
          obj.date = chooseDate[i].value
        }
      }

      // for (let j = 0; j < chooseOrderTypes.length; j++) {
      //   if (chooseOrderTypes[j].name == chooseOrderTypeName) {
      //     obj.chooseOrderType = chooseOrderTypes[j]
      //   }
      // }


      obj.selectShopId = this.state.selectShopId;

      //window.alert(JSON.stringify(obj)) //提交的JSON数据
      this.loadOrderFun(this.state.indexs, 0);
    })

    if (this.state.isShowBatch == true)
      this.changeBatch();//关闭全选
  }


  searchData = (value) => {
    this.setState({ orderIdInputValue: value });
    //window.alert(value) //搜索商品内容
    this.loadOrderFun(this.state.indexs, 0);

    //this.refs.scrollerList.resetLoadmore();//清除加载更多的标记
  }
  inputEvent = (value) => {
    this.setState({ orderIdInputValue: value });
  }
  

  //公共关闭
  closeModal=(modalName)=>{
    this.setState({
      [modalName]:false
    })
  }

  procurementDetailRender = function () {  //采购订单详情
    var orderDetails = this.state.orderDetail;
    return (
      <View className="procurementDetails" onClick={() => { return; }}>
        <View className="procurementDetails-left" onClick={() => this.closeProcurementDetails()}>
        </View>
        <ScrollView className="procurementDetails-scrollView">
          <View className="procurementDetails-right">
            <View className="commonList04">
              {
                this.state.indexs == 0 ? <Text className="commonList04-title">待确认</Text> : null
              }
              {
                this.state.indexs == 1 ? <Text className="commonList04-title">待付款</Text> : null
              }
              {
                this.state.indexs == 2 ? <Text className="commonList04-title">待发货</Text> : null
              }
              {
                this.state.indexs == 3 ? <Text className="commonList04-title">已发货</Text> : null
              }
              {
                this.state.indexs == 4 ? <Text className="commonList04-title">交易完成</Text> : null
              }
              {
                this.state.indexs == 5 ? <Text className="commonList04-title">交易关闭</Text> : null
              }
              {
                this.state.indexs == 6 ? <Text className="commonList04-title">退款中</Text> : null
              }

            </View>
            <View className="procurementDetailsWrap">
              <View className="procurementList">
                <View className="commonList02-left">
                  <Text className="commonList02-left-title">收 货 人 : </Text>
                  <Text className="commonList02-left-content02" style={{ width: 300 }}>{orderDetails.SellerOrder.ToName}</Text>
                </View>
                <View className="commonList02-right">
                  <Text className="commonList02-left-content02">{orderDetails.SellerOrder.ToMobile}</Text>
                </View>
              </View>
              <View className="procurementList bB" style={{ paddingBottom: "25rem" }}>
                <View className="commonList02-left">
                  <Text className="commonList02-left-title">收货地址:</Text>
                  <Text className="commonList02-left-content02" style={{ flex: 1 }}>{orderDetails.SellerOrder.ToFullAddress}</Text>
                  <Icon className="iconfont icon-fuzhi commonList-text02" name="order_list-o" onClick={() => this.copyText(orderDetails.SellerOrder.ToName + " " + orderDetails.SellerOrder.ToMobile + " " + orderDetails.SellerOrder.ToFullAddress)}></Icon>
                </View>
              </View>
              <View className="procurementList">
                <View className="commonList02-left">
                  <Text className="commonList02-left-title">订单来源:</Text>
                  {
                    this.state.selectShopPlatformType == "Taobao" ?
                      <Image className="platform-icon30 mR15" src='https://www.dgjapp.com/public/images/zhipoIcon/platform-icon-Taobao.png' />
                      : null
                  }
                  {
                    this.state.selectShopPlatformType == "KuaiShou" ?
                      <Image className="platform-icon30 mR15" src='https://www.dgjapp.com/public/images/zhipoIcon/platform-icon-KuaiShou.png' />
                      : null
                  }
                  {
                    this.state.selectShopPlatformType == "TouTiao" ?
                      <Image className="platform-icon30 mR15" src='https://www.dgjapp.com/public/images/zhipoIcon/platform-icon-TouTiao.png' />
                      : null
                  }
                  {
                    this.state.selectShopPlatformType == "Pinduoduo" ?
                      <Image className="platform-icon30 mR15" src='https://www.dgjapp.com/public/images/zhipoIcon/platform-icon-Pinduoduo.png' />
                      : null
                  }
                  {
                    this.state.selectShopPlatformType == "WxVideo" ?
                      <Image className="platform-icon30 mR15" src='https://www.dgjapp.com/public/images/zhipoIcon/platform-icon-WxVideo.png' />
                      : null
                  }
                  {
                    this.state.selectShopPlatformType == "XiaoHongShu" ?
                      <Image className="platform-icon30 mR15" src='https://www.dgjapp.com/public/images/zhipoIcon/platform-icon-XiaoHongShu.png' />
                      : null
                  }
                  {
                    this.state.selectShopPlatformType == "YouZan" ?
                      <Image className="platform-icon30 mR15" src='https://www.dgjapp.com/public/images/zhipoIcon/platform-icon-YouZan.png' />
                      : null
                  }
                  {
                    this.state.selectShopPlatformType == "KuaiTuanTuan" ?
                      <Image className="platform-icon30 mR15" src='https://www.dgjapp.com/public/images/zhipoIcon/platform-icon-KuaiTuanTuan.png' />
                      : null
                  }
                  {
                    this.state.selectShopPlatformType == "WeiMeng" ?
                      <Image className="platform-icon30 mR15" src='https://www.dgjapp.com/public/images/zhipoIcon/platform-icon-WeiMeng.png' />
                      : null
                  }
                  <Text className="commonList02-left-content02">{this.state.selectShopName}</Text>
                </View>
              </View>
              <View className="procurementList">
                <View className="commonList02-left">
                  <Text className="commonList02-left-title">订单编号:</Text>
                  <Text className="commonList02-left-content02">{orderDetails.SellerOrder.PlatformOrderId}</Text>
                  <Icon className="iconfont icon-fuzhi commonList-text02" name="order_list-o" onClick={() => this.copyText(orderDetails.SellerOrder.PlatformOrderId)}></Icon>
                </View>
              </View>
              <View className="procurementList">
                <View className="commonList02-left">
                  <Text className="commonList02-left-title">买家名称:</Text>
                  <Text className="fS12">{orderDetails.SellerOrder.BuyerWangWang}</Text>
                  {/* <Icon className="commonList02-left-content02 iconfont icon-wangwang mainColor" name="wangwang"></Icon> */}
                </View>
              </View>
              <View className="procurementList">
                <View className="commonList02-left">
                  <Text className="commonList02-left-title">付款时间:</Text>
                  <Text className="commonList02-left-content02">{orderDetails.SellerOrder.PayTime}</Text>
                </View>
              </View>


              {
                orderDetails.SellerOrder.OrderItems.map((itemSellerSkuList) =>
                  <View className="productWrap" style={{width:650}}>
                    <View className="productWrap-show">
                      <View className="productWrap-show-left">
                        <Image className="productWrap-left-img" src={itemSellerSkuList.ProductImgUrl} />
                        {itemSellerSkuList.IsFenXiao == false ? <Text className="platform-Status" style={{ backgroundColor: "#f7941f" }}>未分销</Text> : null}
                        {
                          itemSellerSkuList.IsFenXiao == true && itemSellerSkuList.RefundStatus != "" && itemSellerSkuList.RefundStatus != null && itemSellerSkuList.RefundStatus != "REFUND_SUCCESS" ? <Text className="platform-Status" style={{ backgroundColor: "#fe6f4f" }}>退款中</Text> : null
                        }
                        {
                          itemSellerSkuList.IsFenXiao == true && itemSellerSkuList.RefundStatus != "" && itemSellerSkuList.RefundStatus != null && itemSellerSkuList.RefundStatus == "REFUND_SUCCESS" ? <Text className="platform-Status" style={{ backgroundColor: "#fe6f4f" }}>退款完成</Text> : null
                        }
                        {
                          itemSellerSkuList.IsFenXiao == true && (itemSellerSkuList.RefundStatus == "" || itemSellerSkuList.RefundStatus == null) && itemSellerSkuList.Status == "waitbuyerreceive" ? <Text className="platform-Status" style={{ backgroundColor: "#3aadff" }}>已发货</Text> : null
                        }

                      </View>
                      <View className="productWrap-show-right" style={{ justifyContent: "flex-start" }}>
                        <View className="productWrap-right-PartTwo mB6">
                          <Text className="fS12 productWrap-right-text">{itemSellerSkuList.ProductSubject.length>20?itemSellerSkuList.ProductSubject.substring(0,20)+"...":itemSellerSkuList.ProductSubject}</Text>
                        </View>
                        <View className="productWrap-right-PartFive mB6">
                          <Text className="fS10 errorColor mB15">￥{itemSellerSkuList.ItemAmount}</Text>
                          <Text className="fS10 errorColor">x{itemSellerSkuList.Count}</Text>
                        </View>
                        <View className="productWrap-right-PartThree mB6">
                          <Text className="fS10 warnColor">{itemSellerSkuList.Color}{itemSellerSkuList.Size}</Text>
                          {
                            itemSellerSkuList.IsFenXiao == true && itemSellerSkuList.IsMapping == false ?
                              <Text className="productWrap-right-text03">规格未匹配</Text>
                              : null
                          }

                          {
                            itemSellerSkuList.IsFenXiao == true && itemSellerSkuList.IsSendFaild == true ?
                              <Text className="productWrap-right-text03" style={{ backgroundColor: "#fe6f4f", color: "#fffefe", width: "300rem" }} onClick={() => this.onlineSendErrorMsg(orderDetails.SellerOrder.PlatformOrderId, itemSellerSkuList.OrderItemCode)}>自动发货失败，点击查看详情</Text>
                              : null
                          }
                        </View>

                      </View>
                    </View>
                  </View>

                )
              }

              <View className="procurementList" style={{ paddingBottom: "25rem" }}>
                <View className="commonList02-left"></View>
                <View className="commonList02-right">
                  <Text className="commonList02-left-content02">{orderDetails.SellerOrder.ProductCount}种商品共计{orderDetails.SellerOrder.ProductItemCount}件  已付款:(含运费:￥{orderDetails.SellerOrder.ShippingFee})</Text>
                  <Text className="fS12 errorColor">￥{orderDetails.SellerOrder.TotalAmount}</Text>
                </View>
              </View>
            </View>

            {
              orderDetails.BuyerOrders.map((itemBuyList) =>
                <View className="procurementDetailsWrap">
                  <View className="procurementList">
                    <View className="commonList02-left" style={{ flex: 1 }}>
                      <Text className="commonList02-left-title">采购单号:</Text>
                      <View className="payTypeWrap">
                        <Text className="commonList02-left-content">
                          {itemBuyList.BuyerOrder == null
                            || (itemBuyList.BuyerOrder != null && (itemBuyList.BuyerOrder.PlatformOrderId == ""
                              || itemBuyList.BuyerOrder.PlatformOrderId == null))
                            ? "确认后生成"
                            : itemBuyList.BuyerOrder.PlatformOrderId
                          }
                          {/* <Icon className="iconfont icon-fuzhi commonList-text02" onClick={()=>this.copyText(itemBuyList.BuyerOrder.PlatformOrderId)}></Icon> */}
                        </Text>

                        {
                          itemBuyList.BuyerOrder != null && itemBuyList.BuyerOrder.ExtField1 == "Paying" ?
                            <Text className="payTypeStatus">免密支付中</Text>
                            : null
                        }
                        {
                          itemBuyList.BuyerOrder != null && itemBuyList.BuyerOrder.ExtField1 == "Faild" ?
                            <Text className="payTypeStatus" style={{ backgroundColor: "#fe6f4f" }}>支付失败</Text>
                            : null
                        }

                        {
                          itemBuyList.BuyerOrder != null && itemBuyList.BuyerOrder.TradeType == "Alipay" && itemBuyList.BuyerOrder.ExtField1 == "Success" ?
                            <Text className="payTypeStatus">支付宝</Text>
                            : null
                        }

                        {
                          itemBuyList.BuyerOrder != null && itemBuyList.BuyerOrder.TradeType == "Epay" && itemBuyList.BuyerOrder.ExtField1 == "Success" ?
                            <Text className="payTypeStatus">诚E赊</Text>
                            : null
                        }

                      </View>

                      {
                        itemBuyList.BuyerOrder != null && itemBuyList.IsSendFaild == true ?
                          <Text className="operateMainBtn02" onPress={() => this.reOnlineSend(orderDetails.SellerOrder.OrderCode, itemBuyList.BuyerOrder.OrderCode, itemBuyList.BuyerOrder.PlatformOrderId)} >重新发货</Text>
                          : null
                      }

                    </View>
                  </View>
                  <View className="procurementList">
                    <View className="commonList02-left">
                      <Text className="commonList02-left-title">供应商:</Text>
                      <Text className="fS12">{itemBuyList.SupplierLoginId}</Text>
                      <Icon className="commonList02-left-content iconfont icon-wangwang mainColor" name="wangwang"></Icon>
                    </View>
                  </View>
                  {
                    itemBuyList.BuyerOrder != null ?
                      itemBuyList.BuyerOrder.OrderItems.map((itemBuySkuList) =>
                        <View className="productWrap" style={{width:650}}>
                          <View className="productWrap-show">
                            <View className="productWrap-show-left">
                              <Image className="productWrap-left-img" src={itemBuySkuList.ProductImgUrl} />
                              {/* <Text className="platform-Status">铺货失败</Text> */}
                              {
                                itemBuySkuList.RefundStatus != "" && itemBuySkuList.RefundStatus != null && itemBuySkuList.RefundStatus != "REFUND_SUCCESS" ? <Text className="platform-Status" style={{ backgroundColor: "#fe6f4f" }}>退款中</Text> : null
                              }
                              {
                                itemBuySkuList.RefundStatus != "" && itemBuySkuList.RefundStatus != null && itemBuySkuList.RefundStatus == "REFUND_SUCCESS" ? <Text className="platform-Status" style={{ backgroundColor: "#fe6f4f" }}>退款完成</Text> : null
                              }
                              {
                                (itemBuySkuList.RefundStatus == "" || itemBuySkuList.RefundStatus == null) && itemBuySkuList.Status == "waitbuyerreceive" ? <Text className="platform-Status" style={{ backgroundColor: "#3aadff" }}>已发货</Text> : null
                              }
                            </View>
                            <View className="productWrap-show-right" style={{ justifyContent: "flex-start" }}>
                              <View className="productWrap-right-PartTwo  mB6">
                                <Text className="fS12 productWrap-right-text">{itemBuySkuList.ProductSubject.length>20?itemBuySkuList.ProductSubject.substring(0,20)+"...":itemBuySkuList.ProductSubject}</Text>
                              </View>
                              <View className="productWrap-right-PartFive">
                                <Text className="fS10 errorColor mB15">￥{itemBuySkuList.ItemAmount}</Text>
                                <Text className="fS10 errorColor">x{itemBuySkuList.Count}</Text>
                              </View>
                              <View className="productWrap-right-PartThree  mB6">
                                <Text className="fS10 warnColor">{itemBuySkuList.Color} {itemBuySkuList.Size}</Text>
                              </View>
                            </View>
                          </View>
                        </View>
                      )
                      : null
                  }


                  {
                    itemBuyList.BuyerOrder != null ?
                      <View className="procurementList">
                        <View className="commonList02-left">
                          {itemBuyList.BuyerOrder.PlatformStatus == "waitbuyerpay" ? <Text className="orderStatus">待付款</Text> : null}
                          {itemBuyList.BuyerOrder.PlatformStatus == "waitsellersend" ? <Text className="orderStatus">待发货</Text> : null}
                          {itemBuyList.BuyerOrder.PlatformStatus == "waitbuyerreceive" ? <Text className="orderStatus">已发货</Text> : null}
                        </View>
                        <View className="commonList02-right">
                          <Text className="commonList02-left-content">{itemBuyList.BuyerOrder.ProductCount}种商品共计{itemBuyList.BuyerOrder.ProductItemCount}件  金额:(含运费:￥{itemBuyList.BuyerOrder.ShippingFee})</Text>
                          <Text className="fS12 errorColor">￥{itemBuyList.BuyerOrder.TotalAmount}</Text>
                        </View>
                      </View>
                      : null
                  }



                  {
                    itemBuyList.BuyerOrder != null && (itemBuyList.BuyerOrder.PlatformStatus == "waitbuyerreceive" || itemBuyList.BuyerOrder.PlatformStatus == "waitsellersend") ?
                      <View>
                        <View className="procurementList bT" style={{ paddingTop: "25rem" }}>
                          <View className="commonList02-left">
                            <Text className="commonList02-left-title">物流公司:</Text>
                            <Text className="commonList02-left-content">{itemBuyList.LogisticsInfo.ExpressName}</Text>
                          </View>
                        </View>
                        <View className="procurementList">
                          <View className="commonList02-left">
                            <Text className="commonList02-left-title">物流单号:</Text>
                            <Text className="commonList02-left-content">{itemBuyList.LogisticsInfo.LogisticsBillNo}</Text>
                          </View>
                        </View>
                        <View className="procurementList" style={{ marginBottom: "25rem" }}>
                          <View className="commonList02-left">
                            <Text className="commonList02-left-title">物流状态:</Text>
                            <Text className="commonList02-left-content">{itemBuyList.LogisticsInfo.TraceInfo}</Text>
                          </View>
                        </View>
                      </View>
                      : null
                  }


                  {/* 待确认选项卡 */}
                  {
                    itemBuyList.BuyerOrder == null || (itemBuyList.BuyerOrder != null && (itemBuyList.BuyerOrder.PlatformStatus == "" || itemBuyList.BuyerOrder.PlatformStatus == null)) ?
                      <View className="procurementList bT" style={{ paddingTop: "25rem", paddingBottom: "25rem" }}>
                        <Text className="operateMainBtn02" onPress={() => this.productDetailLink(itemBuyList.BuyerOrder.ProductID)} >货源详情</Text>
                      </View>
                      : null
                  }


                  {
                    itemBuyList.BuyerOrder != null && itemBuyList.BuyerOrder.PlatformStatus == "waitbuyerpay" ?
                      <View className="procurementList bT" style={{ paddingTop: "25rem", paddingBottom: "25rem" }}>
                        <Text className="operateMainBtn02" onPress={() => this.productDetailLink(itemBuyList.BuyerOrder.ProductID)} >货源详情</Text>
                        <Text className="operateMainBtn02" onPress={() => this.orderDetailLink(itemBuyList.BuyerOrder.PlatformOrderId, true, itemBuyList.BuyerOrder.PlatformOrderId, itemBuyList.BuyerOrder.OrderCode)}>取消订单</Text>
                        <Text className="operateMainBtn02" onPress={() => this.orderPaymentByBuyerOrderCode(itemBuyList.BuyerOrder.OrderCode)}>付款</Text>
                      </View>
                      : null
                  }


                  {
                    itemBuyList.BuyerOrder != null && itemBuyList.BuyerOrder.PlatformStatus == "waitsellersend" ?
                      <View className="procurementList bT" style={{ paddingTop: "25rem", paddingBottom: "25rem" }}>
                        <Text className="operateMainBtn02" onPress={() => this.productDetailLink(itemBuyList.BuyerOrder.ProductID)} >货源详情</Text>
                        <Text className="operateMainBtn02" onPress={() => this.orderDetailLink(itemBuyList.BuyerOrder.PlatformOrderId)}>申请退款</Text>
                        <Text className="operateMainBtn02" onPress={() => this.orderDetailLink(itemBuyList.BuyerOrder.PlatformOrderId)}>提醒发货</Text>
                      </View>
                      : null
                  }

                  {
                    itemBuyList.BuyerOrder != null && itemBuyList.BuyerOrder.PlatformStatus == "waitbuyerreceive" ?
                      <View className="procurementList bT" style={{ paddingTop: "25rem", paddingBottom: "25rem" }}>
                        <Text className="operateMainBtn02" onPress={() => this.productDetailLink(itemBuyList.BuyerOrder.ProductID)} >货源详情</Text>
                        <Text className="operateMainBtn02" onPress={() => this.orderDetailLink(itemBuyList.BuyerOrder.PlatformOrderId)}>确认收货</Text>
                        <Text className="operateMainBtn02" onPress={() => this.orderDetailLink(itemBuyList.BuyerOrder.PlatformOrderId)}>订单详情</Text>
                      </View>
                      : null
                  }

                  {
                    itemBuyList.BuyerOrder != null && itemBuyList.BuyerOrder.PlatformStatus == "success" ?
                      <View className="procurementList bT" style={{ paddingTop: "25rem", paddingBottom: "25rem" }}>
                        <Text className="operateMainBtn02" onPress={() => this.orderDetailLink(itemBuyList.BuyerOrder.PlatformOrderId)}>订单详情</Text>
                      </View>
                      : null
                  }
                  {
                    itemBuyList.BuyerOrder != null && itemBuyList.BuyerOrder.PlatformStatus == "cancel" ?
                      <View className="procurementList bT" style={{ paddingTop: "25rem", paddingBottom: "25rem" }}>
                        <Text className="operateMainBtn02" onPress={() => this.productDetailLink(itemBuyList.BuyerOrder.ProductID)} >货源详情</Text>
                        <Text className="operateMainBtn02" onPress={() => this.anewCreateOrder(orderDetails.SellerOrder.OrderCode, itemBuyList.BuyerOrder.OrderCode)}>重新采购</Text>
                        <Text className="operateMainBtn02" onPress={() => this.orderDetailLink(itemBuyList.BuyerOrder.PlatformOrderId)}>订单详情</Text>
                      </View>
                      : null
                  }

                </View>
              )
            }

            <View style={{ height: 200 }}></View>
          </View>
        </ScrollView>
        <View className="procurementDetails-goBack" onClick={() => this.closeProcurementDetails()}>
          <Text className="procurementDetails-goBack-text">返回</Text>
          {
            this.state.indexs == 0 ?
              <Text className="procurementDetails-goBack-text borderRight" onPress={() => this.confirmOrder(orderDetails.SellerOrder.OrderCode)}>确认采购单</Text>
              : null
          }
        </View>

      </View>

    )

  };

  //处理完成后，需要列表移除的调用这个方法
  succeedOrderCodeList = (platformOrderIdOrCode) => {
    var selectList = [];
    if (platformOrderIdOrCode != null && platformOrderIdOrCode != "" && platformOrderIdOrCode != undefined)
      selectList.push(platformOrderIdOrCode);
    else
      selectList = this.state.selectOrderList;

    var orderList = this.state.purchaseOrderList;
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

    //刷新页面
    if (newOrderList.length == 0)
      this.loadOrderFun(this.state.indexs, 0);
    else{
      this.setState({ purchaseOrderList: newOrderList, selectOrderList: [], selectPurchaseOrderList: [] },()=>{
        this.tabheaderNumber(this.state.indexs, newOrderList.length);
      });//从页面中移除
      
    }
     
  }



  //获取单个订单详情  --请求接口
  procurementDetails = (platformOrderId) => {

    var indexs = this.state.indexs;
    var jsonData = this.loadOrderData(indexs);

    var data = {
      PlatformOrderId: platformOrderId,
      OrderStatus: jsonData.OrderStatus,
      RefundStatus: jsonData.RefundStatus,
      ShopId: this.state.selectShopId,
      PlatformType: this.state.selectShopPlatformType
    }

    this.setState({
      myShowLoading: true,//开启动画
      detailsPlatformOrderId: platformOrderId,//订单编号
      syncOrderBySelectOrderStatus: '' //清空临时订单状态，避免其他操作用到这个
    });
    var that = this;
    peizhi.proxyRequest({
      url: "/PurchaseOrder/GetSingleOrder",
      data: data,
      isPinduoduoCloud: that.state.selectShopPlatformType.toLowerCase() == "pinduoduo" ? true : false,
      isJingDongCloud: that.state.selectShopPlatformType.toLowerCase() == "jingdong" ? true : false,
      ownerShopUidToken: that.state.ownerShopUidToken,
      success: (res) => {
        that.setState({ myShowLoading: false });
        if (res.Success) {
          var orderDetail = res.Data;
          //console.log("orderDetail:"+JSON.stringify(orderDetail));
          that.setState({
            orderDetail: orderDetail,
            isShowprocurementDetails: true
          });
        } else
          RAP.toast.show("订单详情获取错误:" + res.Message, RAP.toast.LONG);

      },
      fail: function (error) {
        that.setState({ myShowLoading: false });
      }
    });
  }



  //确认采购单  --请求接口
  createPurchaseOrder() {

    var data = {
      OrderCodeList: this.state.selectOrderList,
      ShopId: this.state.selectShopId
    }
    this.setState({ myShowLoading: true });
    var that = this;
    peizhi.proxyRequest({
      url: "/PurchaseOrder/CreateOrder",
      data: data,
      isPinduoduoCloud: that.state.selectShopPlatformType.toLowerCase() == "pinduoduo" ? true : false,
      isJingDongCloud: that.state.selectShopPlatformType.toLowerCase() == "jingdong" ? true : false,
      ownerShopUidToken: that.state.ownerShopUidToken,
      success: (res) => {

        if (res.Success) {

          var taskCode = res.Data;
          var createOrderTaskCode = { TaskCode: taskCode, Ratio: 0 };
          that.setState({ createOrderTaskCode: createOrderTaskCode });

          setTimeout(() => {
            that.createOrderTask();
          }, 1000);

          // 变更成 任务的方式，等任务完成后，这里会完成
          // var list = res.Data.DataList;
          // var isOpen= res.Data.IsOpen;

          // var errorList=[];//全部成功
          // for (let i = 0; i < list.length; i++) {
          //    var resJson = list[i];
          //    if(resJson.IsSuccess==false)
          //       errorList.push(resJson);
          // }

          // //优先显示错误列表，其次再显示  自动代扣的检测
          // if(errorList.length>0){
          //     that.setState({isShowModalByCreateOrderError:true,createOrderError:errorList});
          //     return;
          // }

          // //成功后，从列表中移除,不管有没有开通
          // that.succeedOrderCodeList();
          // RAP.toast.show("采购单创建成功。",RAP.toast.LONG);

          // //没有错误的列表(errorList) ，没有开通自动代扣(isOpen),没有点击【不再提醒】
          // if(errorList.length==0  && isOpen==false &&that.state.isRemindOpen <8)
          //   that.setState({isShowModalByNotOpen:true,isRemindOpen:that.state.isRemindOpen+1});

        } else {
          that.setState({ myShowLoading: false });
          RAP.toast.show("错误信息:" + res.Message, RAP.toast.LONG);
          that.loadOrderFun(0, 0);
        }


      },
      fail: function (error) {
        that.setState({ myShowLoading: false });
        that.loadOrderFun(0, 0);
      }
    });
  }


  createOrderTask = () => {
    var createOrderTaskCode = this.state.createOrderTaskCode;
    var taskCode = createOrderTaskCode.TaskCode;

    var that = this;
    peizhi.proxyRequest({
      url: "/Common/GetZhuKeReqTask",
      data: { TaskCode: taskCode },
      isPinduoduoCloud: that.state.selectShopPlatformType.toLowerCase() == "pinduoduo" ? true : false,
      isJingDongCloud: that.state.selectShopPlatformType.toLowerCase() == "jingdong" ? true : false,
      ownerShopUidToken: that.state.ownerShopUidToken,
      success: (res) => {
        if (res.Success) {
          var dates = res.Data;
          if (dates.FinishedTime != null && dates.FinishedTime != "" && dates.FinishedTime != undefined) {
            that.setState({ myShowLoading: false, createOrderTaskCode: { TaskCode: '', Ratio: 0 } });

            if (dates.Status == "Error" && dates.ErrorMsg != null && dates.ErrorMsg != undefined && dates.ErrorMsg != "")
                that.setState({isShowCommonError:true,showCommonErrorMessage:"确认采购单任务，失败:"+dates.ErrorMsg});
            else if (dates.Status == "Error" && (dates.RspContent == null || dates.RspContent == undefined))
              RAP.toast.show("确认采购单任务，失败:dates.RspContent 为null", RAP.toast.LONG);
            else {
              var rspContentJson = JSON.parse(dates.RspContent);
              var list = rspContentJson.DataList;
              var isOpen = rspContentJson.IsOpen;
              if (list == null || list == undefined)
                list = [];

              var errorList = [];//全部成功
              for (let i = 0; i < list.length; i++) {
                var resJson = list[i];
                if (resJson.IsSuccess == false)
                  errorList.push(resJson);
              }

              //优先显示错误列表，其次再显示  自动代扣的检测
              if (errorList.length > 0) {
                that.setState({ isShowModalByCreateOrderError: true, createOrderError: errorList });
                return;
              }

              //成功后，从列表中移除,不管有没有开通
              that.succeedOrderCodeList();
              RAP.toast.show("采购单创建成功。", RAP.toast.LONG);

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
          that.setState({ myShowLoading: false, createOrderTaskCode: { TaskCode: '', Ratio: 0 } });
         
          that.setState({isShowCommonError:true,showCommonErrorMessage:res.Messag});

          that.loadOrderFun(0, 0);
        }


      },
      fail: function (error) {
        that.setState({ myShowLoading: false, createOrderTaskCode: { TaskCode: '', Ratio: 0 } });
        that.loadOrderFun(0, 0);
      }
    });


  }




  //重新采购订单  --请求接口
  anewCreateOrder = (salesOrderCode, purchaseOrderCode) => {
    var data = {
      SalesOrderCode: salesOrderCode,
      PurchaseOrderCode: purchaseOrderCode,
      ShopId: this.state.selectShopId
    }
    this.setState({ myShowLoading: true });
    var that = this;
    peizhi.proxyRequest({
      url: "/PurchaseOrder/ReCreateOrder",
      data: data,
      isPinduoduoCloud: that.state.selectShopPlatformType.toLowerCase() == "pinduoduo" ? true : false,
      isJingDongCloud: that.state.selectShopPlatformType.toLowerCase() == "jingdong" ? true : false,
      ownerShopUidToken: that.state.ownerShopUidToken,
      success: (res) => {
        that.setState({ myShowLoading: false });

        if (res.Success) {
          var list = res.Data.DataList;
          var errorList = [];//全部成功
          for (let i = 0; i < list.length; i++) {
            var resJson = list[i];
            if (resJson.IsSuccess == false)
              errorList.push(resJson);
          }

          //优先显示错误列表，其次再显示  自动代扣的检测
          if (errorList.length > 0) {
            that.setState({ isShowModalByCreateOrderError: true, createOrderError: errorList });
            return;
          }

          //成功后，从列表中移除,不管有没有开通
          that.succeedOrderCodeList(salesOrderCode);
          RAP.toast.show("重新采购成功。", RAP.toast.LONG);
          that.setState({ isShowprocurementDetails: false });//关闭详情页面

        } else
          RAP.toast.show("错误信息:" + res.Message, RAP.toast.LONG);

      },
      fail: function (error) {
        that.setState({ myShowLoading: false });
      }
    });

  }

  //是否开通（自动代扣）  --请求接口
  protocalPayOpenConfirm = (isPay) => {

    this.setState({ myShowLoading: true });
    var that = this;
    peizhi.proxyRequest({
      url: "/PurchaseOrder/ProtocalPayOpenConfirm",
      data: {},
      success: (res) => {
        that.setState({ myShowLoading: false })
        if (res.Success) {
          var isOpen = res.Data;
          that.setState({ isShowModalByVerifyOpen: false });
          if (isOpen) {
            if (isPay == true)
              this.getOrderPayType();
            else
              RAP.toast.show("已开通。");
          }
          else {
            if (isPay == true)
              that.setState({ isShowModalByNotOpen: true });
            else
              RAP.toast.show("开通失败！");
          }

          //console.log("是否开通（自动代扣）  --请求接口 protocalPayOpenConfirm"+JSON.stringify(res))
        } else
          RAP.toast.show("错误信息:" + res.Message, RAP.toast.LONG);

      },
      fail: function (error) {
        that.setState({ myShowLoading: false });
      }
    });
  }

  //（点击待付款时会检查）检查已开通但是没有开启的  --请求接口
  openUpAndNotOpenFun() {
    var that = this;
    // peizhi.proxyRequest({
    //   url: "/PurchaseOrder/...",//接口还没写
    //   data: {},
    //   success: (res) => {
    //     if (res.Success) {
    //         that.setState({isShowModalByOpenUpAndNotOpen:true});
    //     } else {
    //     }
    //   },
    //   fail: function (error) {
    //   }
    // });
  }

  //获取【支付方式】  --请求接口
  getOrderPayType = () => {

    var buyerIdList = this.state.selectPurchaseOrderList;

    var data = {
      BuyerOrderCodes: buyerIdList
    }
    this.setState({ myShowLoading: true });
    var that = this;
    peizhi.proxyRequest({
      url: "/PurchaseOrder/GetOrderPayType",
      data: data,
      isPinduoduoCloud: that.state.selectShopPlatformType.toLowerCase() == "pinduoduo" ? true : false,
      isJingDongCloud: that.state.selectShopPlatformType.toLowerCase() == "jingdong" ? true : false,
      ownerShopUidToken: that.state.ownerShopUidToken,
      success: (res) => {
        that.setState({ myShowLoading: false });
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
          RAP.toast.show("错误信息:" + res.Message, RAP.toast.LONG);
      },
      fail: function (error) {
        that.setState({ myShowLoading: false });
      }
    });
  }

  //获取订单的【支付链接】  --请求接口
  getOrderPayUrl = () => {
    var buyerIdList = this.state.selectPurchaseOrderList;
    var data = {
      BuyerOrderCodes: buyerIdList
    }

    this.setState({ myShowLoading: true });
    var that = this;
    peizhi.proxyRequest({
      url: "/PurchaseOrder/getOrderPayUrl",
      data: data,
      isPinduoduoCloud: that.state.selectShopPlatformType.toLowerCase() == "pinduoduo" ? true : false,
      isJingDongCloud: that.state.selectShopPlatformType.toLowerCase() == "jingdong" ? true : false,
      ownerShopUidToken: that.state.ownerShopUidToken,
      success: (res) => {
        that.setState({ myShowLoading: false })
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
            //跳转支付 payUrl
            RAP.toast.show("跳转链接");
            var url = decodeURIComponent(payUrl);//跳转去手动支付，这个链接是开通了白名单
            RAP.navigator.push({
              url: url,
            });

            //跳转后提示确认
            setTimeout(() => {
              that.setState({ isShowModalByPayUrl: true });
            }, 1000);
          }
        } else
          RAP.toast.show("错误信息:" + res.Message, RAP.toast.LONG);

      },
      fail: function (error) {
        that.setState({ myShowLoading: false });
      }
    });
  }

  //自动代扣  --请求接口
  autoPaying = () => {
    var buyerIdList = this.state.selectPurchaseOrderList;
    var data = {
      BuyerOrderCodes: buyerIdList
    }

    this.setState({ myShowLoading: true });
    var that = this;
    peizhi.proxyRequest({
      url: "/PurchaseOrder/AutoPay",
      data: data,
      isPinduoduoCloud: that.state.selectShopPlatformType.toLowerCase() == "pinduoduo" ? true : false,
      isJingDongCloud: that.state.selectShopPlatformType.toLowerCase() == "jingdong" ? true : false,
      ownerShopUidToken: that.state.ownerShopUidToken,
      success: (res) => {
        that.setState({ myShowLoading: false, isShowModalBySelectPayment: false })
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

          // if(res.Data.IsOk==true)
          // {
          //   that.setState({isShowModalByAutoPaymentSuccess:true});
          // }else
          //   that.setState({isShowModalByAutoPaymentError:true});
        } else
          RAP.toast.show("错误信息:" + res.Message, RAP.toast.LONG);

      },
      fail: function (error) {
        that.setState({ myShowLoading: false });
      }
    });
  }


  reOnlineSend = (salesOrderCode, purchaseOrderCode, buyerPlatformOrderId) => {
    var data = {
      SalesOrderCode: salesOrderCode,
      PurchaseOrderCode: purchaseOrderCode,
      PurchaseOrderId: buyerPlatformOrderId,
      ShopId: this.state.selectShopId
    }
    this.setState({ myShowLoading: true, buyerPlatformOrderId: buyerPlatformOrderId });
    var that = this;
    peizhi.proxyRequest({
      url: "/PurchaseOrder/ReOnlineSend",
      data: data,
      isPinduoduoCloud: that.state.selectShopPlatformType.toLowerCase() == "pinduoduo" ? true : false,
      isJingDongCloud: that.state.selectShopPlatformType.toLowerCase() == "jingdong" ? true : false,
      ownerShopUidToken: that.state.ownerShopUidToken,
      success: (res) => {
        that.setState({ myShowLoading: false });

        if (res.Success) {
          RAP.toast.show("重新发货成功。", RAP.toast.LONG);

          that.syncOneOrder("seller", "reOnlineSendButton");//同步并查询一次
        } else
          RAP.toast.show("错误信息:" + res.Message, RAP.toast.LONG);

      },
      fail: function (error) {
        that.setState({ myShowLoading: false });
      }
    });

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
      data.ShopId = this.state.selectShopId;
      url = "/Order/SyncSingleOrder";
    }

    this.setState({ myShowLoading: true });
    var that = this;
    peizhi.proxyRequest({
      url: url,
      data: data,
      isPinduoduoCloud: that.state.selectShopPlatformType.toLowerCase() == "pinduoduo" ? true : false,
      isJingDongCloud: that.state.selectShopPlatformType.toLowerCase() == "jingdong" ? true : false,
      ownerShopUidToken: that.state.ownerShopUidToken,
      success: (res) => {

        that.setState({ myShowLoading: false });
        if (res.Success) {
          var list = res.Data;
          if (list != null && list.length > 0) {
            var order = list[0];
            //说明取消成功，重新查询，（取消成功后会变成待确认）
            if (operation == "cancelButton") {
              if (order.PlatformStatus == "cancel") {
                that.setState({ syncOrderBySelectOrderStatus: "waitpurchase" });
                that.succeedOrderCodeList(detailsPlatformOrderId);//从列表移除
                that.procurementDetails(detailsPlatformOrderId);
              } else
                RAP.toast.show("订单没有取消成功！");
            }

            //重新发货的操作
            if (operation == "reOnlineSendButton") {
              //说明重新发货，所有的平台订单已经发货成功
              if (order.PlatformStatus == "waitbuyerreceive") {
                that.setState({ syncOrderBySelectOrderStatus: "waitbuyerreceive" });
                that.succeedOrderCodeList(detailsPlatformOrderId);//从列表移除
              }

              that.procurementDetails(detailsPlatformOrderId);
            }

          }

        } else
          RAP.toast.show("错误信息:" + res.Message, RAP.toast.LONG);
      },
      fail: function (error) {
        that.setState({ myShowLoading: false });
      }
    });
  }
  
  //忽略订单
  ignoreOrder=(orderCode,isIgnore)=>{
    var selectList = [];
    if (peizhi.isNotNull(orderCode))
      selectList.push(orderCode);
    else
      selectList = this.state.selectOrderList;


    if (selectList.length == 0) {
      RAP.toast.show("请选择订单");
      return;
    }

    var data={
      IgnoreOrderCodes:selectList,
      IgnoreType:isIgnore,
      ShopId:this.state.selectShopId
    }
   
    this.setState({ myShowLoading: true });
    var that = this;
    peizhi.proxyRequest({
      url: "/PurchaseOrder/BatchIgnoreOrder",
      data: data,
      isPinduoduoCloud: that.state.selectShopPlatformType.toLowerCase() == "pinduoduo" ? true : false,
      isJingDongCloud: that.state.selectShopPlatformType.toLowerCase() == "jingdong" ? true : false,
      ownerShopUidToken: that.state.ownerShopUidToken,
      success: (res) => {
        //RAP.toast.show("json:" + JSON.stringify(res), RAP.toast.LONG);
        that.setState({ myShowLoading: false });
        if (res.Success) {
          if(isIgnore == 1)
              RAP.toast.show("订单忽略成功。", RAP.toast.LONG);
          else
              RAP.toast.show("已成功取消。", RAP.toast.LONG);
         
          if (peizhi.isNotNull(orderCode))
             that.succeedOrderCodeList(orderCode);
          else
             that.succeedOrderCodeList();

        } else
          RAP.toast.show("错误信息:" + res.Message, RAP.toast.LONG);
      },
      fail: function (error) {
        RAP.toast.show("json:" + JSON.stringify(error), RAP.toast.LONG);
        that.setState({ myShowLoading: false });
      }
    });


  }

     
  //===========================弹框操作========================================

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

  //检测到没有开通自动代扣，弹框 --关闭
  notOpenShowModalByClose = () => {
    this.setState({ isShowModalByNotOpen: false });
  }
  //检测到没有开通自动代扣，弹框 --确认
  notOpenShowModalByConfirm = () => {
    //前往开通后，2秒弹出这个验证框

    var url = decodeURIComponent(this.state.openUrl);//跳转去开通代扣的链接，这个链接是开通了白名单
    RAP.navigator.push({
      url: url,
    });

    this.setState({ isShowModalByNotOpen: false });

    setTimeout(() => {
      this.setState({ isShowModalByVerifyOpen: true });
    }, 2000);


  }


  //确认采购单，错误提示弹框  确认关闭按钮
  createOrderErrorShowModalByConfirm = () => {
    this.setState({ isShowModalByCreateOrderError: false, createOrderError: [] });

    this.loadOrderFun(0, 0);
  }


  //点击开通按钮（会跳转或者复制链接）后2秒提示这个弹框，弹框 --关闭
  verifyOpenShowModalByClose = () => {
    this.setState({ isShowModalByVerifyOpen: false });
  }
  //点击开通按钮（会跳转或者复制链接）后2秒提示这个弹框，弹框 --确认
  verifyOpenShowModalByConfirm = () => {
    this.protocalPayOpenConfirm();
  }



  //选择付款方式，弹框 --手动支付
  selectPaymentShowModalByManual = () => {

    var buyerIdList = this.state.selectPurchaseOrderList;
    if (buyerIdList.length > 50) {
      RAP.toast.show("手动支付，不能超过50个订单");
      return;
    }

    this.setState({ isShowModalBySelectPayment: false });
    this.getOrderPayUrl();//获取支付链接
  }
  //选择付款方式，弹框 --自动支付
  selectPaymentShowModalByConfirm = () => {
    this.autoPaying();
  }
  //选择付款方式，弹框 --关闭
  selectPaymentShowModalByClose = () => {
    this.setState({ isShowModalBySelectPayment: false });
  }


  //已取消  --点击确认
  cancelExamineShowModalByConfirm = () => {
    this.setState({ isShowModalByCancelExamine: false });

    this.syncOneOrder("buyer", "cancelButton");
  }

  //已取消  --关闭
  cancelExamineShowModalByClose = () => {
    this.setState({ isShowModalByCancelExamine: false });

  }


  //自动代扣失败，弹框 --关闭
  autoPaymentErrorShowModalByClose = () => {
    this.setState({ isShowModalByAutoPaymentError: false });
  }

  //自动代扣失败，弹框 --确认  --转手动支付
  autoPaymentErrorShowModalByConfirm = () => {
    var buyerIdList = this.state.selectPurchaseOrderList;
    if (buyerIdList.length > 50) {
      RAP.toast.show("手动支付，不能超过50个订单");
      return;
    }
    this.setState({ isShowModalByAutoPaymentError: false });//关闭失败的弹框

    //自动代扣失败后，可以选择手动支付
    //获取支付链接
    this.getOrderPayUrl();
  }

  //自动代扣成功，弹框 --确认 
  autoPaymentSuccessShowModalByConfirm = () => {
    this.setState({ isShowModalByAutoPaymentSuccess: false });

    this.loadOrderFun(0, 0);
  }


  //点击待付款时，检查是否开通了代扣，但是开关没开启   --关闭
  //  openUpAndNotOpenShowModalByClose=()=>{
  //     this.setState({isShowModalByOpenUpAndNotOpen:false});
  //  }
  //点击待付款时，检查是否开通了代扣，但是开关没开启   --确认
  //  openUpAndNotOpenShowModalByConfirm=()=>{

  //  }


  //获取【支付方式】失败 弹框--关闭
  selectPaymentErrorShowModalByClose = () => {
    this.setState({ isShowModalBySelectPaymentError: false });
  }

  //获取【支付链接】失败 弹框--关闭
  payUrlErrorShowModalByClose = () => {
    this.setState({ isShowModalByPayUrlError: false });
  }


  //手动支付跳转后 弹框--确认按钮
  payUrlShowModalByConfirm = () => {
    this.setState({ isShowModalByPayUrl: false });
    this.loadOrderFun(0, 0);
  }

  //手动支付跳转后 弹框--关闭
  payUrlShowModalByClose = () => {
    this.setState({ isShowModalByPayUrl: false });
  }

  //===========================弹框操作end=======================================


  //跳转到阿里App官方页面
  //订单详情页面
  orderDetailLink = (orderId, isInspect, buyerPlatformOrderId, buyerPlatformOrderCode) => {

    if (isInspect == true) {
      var that = this;
      setTimeout(() => {
        that.setState({ isShowModalByCancelExamine: true, buyerPlatformOrderId: buyerPlatformOrderId, buyerPlatformOrderCode: buyerPlatformOrderCode });
      }, 1000);
    }

    //RAP.biz.getBizInfoUrl('orderDetail', {orderId:orderId}) 由于这个获取链接，是trade2.m.1688.com,导致跳转失败。
    var url = RAP.biz.getBizInfoUrl('orderDetail', { orderId: orderId });
    //url=url.replace('trade2','trade');
    RAP.navigator.push({//用官方的界面
      url: url,
    });
  }




  //跳转到阿里App官方页面
  //商品详情页面,需要咨询官方，拿页面
  productDetailLink = (productId) => {
    RAP.navigator.push({//用官方的界面
      url: RAP.biz.getBizInfoUrl('offerDetail', { offerId: productId }),
    });
  }

  //旺旺跳转
  toWangWang = (wangwang) => {
    RAP.aliwangwang.openChat(wangwang);

  }
  searchTradingclose = (e, refundType) => {
    var that=this;
    this.setState({
      refundType
    },()=>{
      that.loadOrderFun(that.state.indexs, 0);
    })

  }

  render() {

    return (
      <RoxStyleProvider>
        <Advertising  pageName="procurementOrder" />
        {this.state.noticeContent ?
          <View className="notice">
            <Text style={{ fontSize: 24, color: "#ff511c", wordWrap: "break-word", width: 700, lineHeight: "30rem" }}>{this.state.noticeContent}</Text>
          </View> : null
        }

        <SearchModal
          isRadio={true}
          shopList={this.state.shopList}
          onClickShop={this.onClickShop} //弹窗里面  开始搜索 按钮
          searchData={this.searchData}   //搜索框  搜索 按钮
          selectTitle={this.state.selectTitle}
          selectShopId={this.state.selectShopId}
          changeBtnName={'开始搜索'}
          placeholder={'请输入订单编号'}
          inputEvent={this.inputEvent}
        >
          <View className="chooseShop-main" onClick={() => { return; }}>

            <View className="chooseShop-main-title"><Text className="chooseShop-main-titleText">日期选择</Text></View>
            <View className="chooseShop-main-content" style={{ flexWrap: "nowrap" }}>
              {
                this.state.chooseDate.map((item) =>
                  item.isSelect ?
                    <Text onPress={() => this.chooseDate(item.value)} className="chooseShop-main-time chooseShop-main-timeActive">{item.title}</Text>
                    : <Text onPress={() => this.chooseDate(item.value)} className="chooseShop-main-time">{item.title}</Text>
                )
              }
            </View>

            <View className="chooseShop-main-title"><Text className="chooseShop-main-titleText">订单展示</Text></View>
            <View className="chooseShop-main-content" style={{ flexWrap: "nowrap" }}>
              {
                this.state.chooseOrderShowTypes.map((item) =>
                  item.isSelect ?
                    <Text onPress={() => this.chooseOrderShow(item.value)} className="chooseShop-main-time chooseShop-main-timeActive">{item.title}</Text>
                    : <Text onPress={() => this.chooseOrderShow(item.value)} className="chooseShop-main-time">{item.title}</Text>
                )
              }
            </View>

            {/* <View className="chooseShop-main-title"><Text className="chooseShop-main-titleText">精准查询</Text></View>
            <View className="chooseShop-main-content" style={{ paddingTop: "25rem", paddingBottom: "25rem" }}>
              <View className="searchWrap">
                <View className="selectWrap">
                  <Picker
                    selectedValue={this.state.chooseOrderTypeName}
                    style={{
                      fontSize: 24
                    }}
                    onValueChange={this.handleSelectOrderType}
                  >
                    {
                      this.state.chooseOrderTypes.map((item) =>
                        <Picker.Item value={item.name} label={item.name} />
                      )
                    }
                  </Picker>
                  <Icon className="fS12" name="menu_down"></Icon>
                </View>
                <Input value={this.state.chooseOrderTypeValue} onInput={(value) => this.changeOrderTypeInput(value)} style={{ height: 60, flex: 1, marginLeft: 5, fontSize: 24 }} placeholder={'输入搜索内容'} />
              </View>
            </View> */}


          </View>
        </SearchModal>


        {/* <Tabheader
          dataSource={this.state.dataSource}
          initIndex={this.state.indexs}
          height={80}
          itemWidth={187}
          type={'normal'}
          isDrop={false}
          fontSize={28}
          selectTextColor={'#3aadff'}
          selectLineColor={'#3aadff'}
          defaultTextColor={'#000'}
          dropTitle={'选择状态'}
          dropSelectColor={'#3aadff'}
          isShowSelectLine={true}
          onSelect={(index) => { this.statusTab(index) }}
        /> */}

        <MyTabheader itemWidth={168} selectNav={this.selectItem} dataSource={this.state.dataNavs} />

        <View className="batchWrap" style={{ justifyContent: "flex-start" }}>
          <View className="batchWrap-left" onClick={() => { this.changeBatch() }}>
            {
              this.state.isShowBatch ?
                <Text className="fS12" style={{ color: "#f7941f" }}>批量操作</Text> :
                <Text className="fS12">批量操作</Text>
            }
            {
              this.state.isShowBatch ?
                <Icon className="iconfont-downActive" name="menu_up"></Icon> : <Icon className="iconfont-down" name="menu_down"></Icon>
            }
          </View>

          {
            this.state.isShowSearchWarn ?
              <View className="searchWarn">
                <Text className="searchWarn-title">采购单:</Text>
                {
                  this.state.refundType == "noRefund" ?
                    <Text className="searchBtnActive" onClick={(e) => this.searchTradingclose(e, "noRefund")}>未申请退款</Text> :
                    <Text className="searchBtn" onClick={(e) => this.searchTradingclose(e, "noRefund")}>未申请退款</Text>
                }
                {
                  this.state.refundType == "refund" ?
                    <Text className="searchBtnActive" onClick={(e) => this.searchTradingclose(e, "refund")}>退款中</Text> :
                    <Text className="searchBtn" onClick={(e) => this.searchTradingclose(e, "refund")}>退款中</Text>
                }
              </View> : null
          }


        </View>
        <ListView
          ref='scrollerList'
          renderHeader={this.renderHeader}
          renderFooter={this.renderFooter}
          renderRow={this.renderItem}
          dataSource={this.state.purchaseOrderList}
          style={styles.listContainer}
          onEndReached={this.onLoadMore}
        />
        {
          this.state.noneData && this.state.isAuthShop !=true?
            <View className="noData-wrap">
              <View className="noData-wrap-main">
                <Image src="https://dgjapp.com/public/images/zhipoIcon/noData02.png" style={{ width: '360rem', height: '250rem' }} />
                <Text style={{ fontSize: '28rem', color: '#999' }}>暂无订单数据</Text>
                <Text className="changButton mainBtn mT25" type="normal" onPress={() => this.requestProxy(this.state.indexs, 0)}>刷新数据</Text>
              </View>
            </View> : null
        }
        {
          this.state.isAuthShop ==true ?
            <View className="noData-wrap">
              <View className="noData-wrap-main">
                <Image src="https://dgjapp.com/public/images/zhipoIcon/noData02.png" style={{ width: '360rem', height: '250rem' }} />
                <Text style={{ fontSize: '28rem', color: 'red',alignItems:'center',paddingLeft: "20rem", paddingRight: "20rem" }}>店铺授权已失效，请前往【个人中心】→</Text>
                <Text style={{ fontSize: '28rem', color: 'red',alignItems:'center',paddingLeft: "20rem", paddingRight: "20rem" }}>【店铺管理】页面重新授权店铺</Text>
              </View>
            </View> : null
        }


        {
          this.state.selectPurchaseOrderList.length > 50 ?
            <View className="wran-chooseOrder">
              <Text className="wran-chooseOrder-title">当前选择{this.state.selectPurchaseOrderList.length}采购单超过</Text>
              <Text style={{ color: "#ff511c", fontSize: "24rem" }}>50</Text>
              <Text className="wran-chooseOrder-title">笔,无法使用手动支付,</Text>
              <Text className="wran-chooseOrder-title">建议开通自动代扣,</Text>
              <Text className="wran-chooseOrder-title" style={{ color: "#3aadff" }} onPress={() => this.autoWithholdLink()}>去开通》</Text>
            </View>
            : null
        }

        {  //批量操作按钮
          this.state.isShowBatch ?
            <View className="footerBtn">
              <View className="footerBtn-left">
                <Checkbox size="small" onChange={this.allChange} />
                <Text className="fS12">已选{this.state.selectOrderList.length}个订单</Text>
              </View>
              <View className="footerBtn-right">
                <Text className="footerBtn-right-btn footerBtn-right-btnBorder" onPress={() => this.batchCancel()}>取消</Text>
                {
                  this.state.indexs == 0 ? <Text className="footerBtn-right-btn" onPress={() => this.confirmOrder()}>批量确认</Text> : null
                }
                {
                  this.state.indexs == 1 ? <Text className="footerBtn-right-btn" onPress={() => this.orderPayment()}>批量付款</Text> : null
                }
                {
                  this.state.indexs == 7 ? <Text className="footerBtn-right-btn" onPress={() => this.ignoreOrder('',0)}>批量取消</Text> : null
                }
              </View>
            </View> : null
        }

        {
          this.state.isShowprocurementDetails ? this.procurementDetailRender() : null
        }

        {/* 没有映射，提示 */}
        <MyShowModal showModalActive={this.state.isShowModalBynotCategory} btns={false} title={'提示'} tRClose={false} titleClose={true} shadeClose={true}  cancelhowModal={()=>this.closeModal("isShowModalBynotCategory")}>
          <View className="Dialog-wrap" style={{ display: "flex", flexDirection: "column" }}>
            <View className="Dialog-content" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <View className="MyShowModal-contentCenter">
                <Icon className="infomation-circle MyShowModal-icon" name="infomation-circle"></Icon>
              </View>
              <View>
                <Text className="Dialog-content-text" style={{ fontSize: "32rem", paddingLeft: "15rem", lineHeight: "40rem" }}>有订单商品未匹配规格，前往匹配规格。</Text>
                <Text className="Dialog-content-text" style={{ fontSize: "28rem", color: "#000", paddingLeft: "15rem" }}>{this.state.notCategoryListTitle}</Text>
              </View>
            </View>
            <View className="MyShowModal-btns">
              <Text className="MyShowModal-btns-item MyShowModal-cancleBtn" onClick={() => this.notCategoryByClose()}>关闭</Text>
              <Text className="MyShowModal-btns-item" onClick={() => this.notCategoryByOk()}>前往设置</Text>
            </View>
          </View>
        </MyShowModal>

        {/* 批量开启时，提示 */}
        <MyShowModal showModalActive={this.state.isShowModalByBatchOpen} btns={false} title={'提示'} titleClose={true} tRClose={false} shadeClose={true}  cancelhowModal={()=>this.closeModal("isShowModalByBatchOpen")}>
          <View className="Dialog-wrap" >
            <View className="MyShowModal-contentCenter">
              <Icon className="infomation-circle MyShowModal-icon" name="infomation-circle"></Icon>
            </View>
            <View className="MyShowModal-contentCenter">
              <Text className="Dialog-content-text" style={{ marginBottom: "20rem", fontSize: "30rem", color: "#888", paddingLeft: "15rem",paddingTop:"10rem" }}>批量手动付款最多只支持<Text style={{color:"#ff4001"}}>50</Text>笔。</Text>
              <Text className="Dialog-content-text" style={{ fontSize: "30rem", color: "#888", paddingLeft: "15rem" }}>自动代扣不限制。</Text>
            </View>
            <View className="MyShowModal-btns">
              <Text className="MyShowModal-btns-item MyShowModal-cancleBtn" onClick={() => this.batchOpenShowModalByClose()}>不在提示</Text>
              <Text className="MyShowModal-btns-item" onClick={() => this.batchOpenShowModalByConfirm()}>确定</Text>
            </View>
          </View>
        </MyShowModal>


        {/* 确认采购订单，有失败的，会弹这个框  New */}
        <MyShowModal showModalActive={this.state.isShowModalByCreateOrderError} btns={false} title={'采购单生成错误'} tRClose={false} shadeClose={true}  cancelhowModal={()=>this.createOrderErrorShowModalByConfirm()}>
          <View className="Dialog-wrap" >
            <View className="Dialog-content newDialog-content" style={{ display: "flex", flexDirection: "column" }}>
              <ScrollView style={{ flex: 1 }}>
                {
                  this.state.createOrderError.map((item) =>
                    <View className="newDialog-content-tr">
                      {/* 第一列 */}
                      <View className="newDialog-content-td">
                        {
                          item.SalesOrderIds.map((itemOrderList) =>
                            <Text className="fS10">{itemOrderList}</Text>
                          )
                        }
                      </View>
                      {/* 第二列 */}
                      <View className="newDialog-content-td">
                        <Text className="fS10">{item.BuyerOrderId}</Text>
                      </View>
                      {/* 第三列 */}
                      <View className="newDialog-content-td">
                        <Text className="fS10">{item.ErrorMessage}</Text>
                      </View>
                    </View>
                  )
                }
              </ScrollView>
            </View>
            <View className="MyShowModal-btns">
              <Text className="MyShowModal-btns-item" onClick={() => this.createOrderErrorShowModalByConfirm()}>确认关闭</Text>
            </View>
          </View>
        </MyShowModal>

        {/* 检测到没有开通自动代扣，提示 */}
        <MyShowModal showModalActive={this.state.isShowModalByNotOpen} btns={false} title={'提示'} tRClose={false} shadeClose={true}  cancelhowModal={()=>this.closeModal("isShowModalByNotOpen")}>
          <View className="Dialog-wrap" >
            <View className="Dialog-content">
              <Text className="Dialog-content-text" style={{ marginBottom: "20rem", fontSize: "29rem", color: "#000" }}>检测到您未开通自动代扣，是否前往开通？</Text>
              <Text className="Dialog-content-text" style={{ marginBottom: "20rem", fontSize: "26rem" }}>向供应商付款时只需点击按钮,无需手动支付</Text>
              <Text className="Dialog-content-text" style={{ color: "#f7941f", fontSize: "26rem" }}>温馨提示：可到个人中心设置开通。</Text>
            </View>
            <View className="MyShowModal-btns">
              <Text className="MyShowModal-btns-item MyShowModal-cancleBtn" style={{ color: '#888' }} onClick={() => this.notOpenShowModalByClose()}>关闭</Text>
              <Text className="MyShowModal-btns-item" onClick={() => this.notOpenShowModalByConfirm()}>前往开通</Text>
              {/* <Link
                activeStyle={styles.activeStyle}
                target="_blank"
                href={this.state.openUrl}
                onPress={()=>this.notOpenShowModalByConfirm()}
                className="MyShowModal-btns-item MyShowModal-cancleBtn"
                style={{color:"#3aadff"}}
              >
                前往开通
              </Link> */}
            </View>
          </View>
        </MyShowModal>


        {/* 点击开通按钮（会跳转或者复制链接）后2秒提示这个弹框，提示 */}
        <MyShowModal showModalActive={this.state.isShowModalByVerifyOpen} btns={false} title={'提示'} tRClose={false} shadeClose={true} cancelhowModal={()=>this.closeModal("isShowModalByVerifyOpen")}>
          <View className="Dialog-wrap" >
            <View className="Dialog-content" style={{ paddingTop: "40rem", paddingBottom: "40rem" }}>
              <Text className="Dialog-content-text" style={{ fontSize: "30rem" }}>操作完成后，请根据情况进行确认</Text>
            </View>
            <View className="MyShowModal-btns">
              <Text className="MyShowModal-btns-item MyShowModal-cancleBtn" onClick={() => this.verifyOpenShowModalByClose()}>未开通</Text>
              <Text className="MyShowModal-btns-item" onClick={() => this.verifyOpenShowModalByConfirm()}>已开通</Text>
            </View>
          </View>
        </MyShowModal>


        {/* 选择付款方式，提示 */}
        <MyShowModal cancelhowModal={this.selectPaymentShowModalByClose} showModalActive={this.state.isShowModalBySelectPayment} btns={false} title={'待付款金额' + this.state.showModalByPaymentPaymentMoney + '元'} tRClose={false} shadeClose={true}>
          <View className="Dialog-wrap" >
            <View className="Dialog-content">
              {
                this.state.isShowAutoPayButton == true ?
                  <Text className="Dialog-content-text">免密支付优先使用诚e赊代扣,若失败则使用支付宝代扣</Text>
                  : <Text className="Dialog-content-text">是否使用手动支付？</Text>
              }
              {/* <Text className="Dialog-content-text" style={{fontSize:"28rem",color:"#000"}}>是否使用自动代扣？</Text> */}

            </View>
            <View className="MyShowModal-btns">
              <Text className="MyShowModal-btns-item MyShowModal-btn02" onClick={() => this.selectPaymentShowModalByManual()}>手动支付</Text>
              {
                this.state.isShowAutoPayButton == true ?
                  <Text className="MyShowModal-btns-item" onClick={() => this.selectPaymentShowModalByConfirm()}>免密支付</Text>
                  : null
              }
            </View>
          </View>
        </MyShowModal>

        {/* 自动代扣失败，提示 */}
        <MyShowModal showModalActive={this.state.isShowModalByAutoPaymentError} btns={false} title={'提示'} titleClose={true} tRClose={false} shadeClose={true}  cancelhowModal={()=>this.closeModal("isShowModalByAutoPaymentError")}>
          <View className="Dialog-wrap" >
            <View className="MyShowModal-contentCenter">
              <Icon className="infomation-circle MyShowModal-icon" style={{ color: "#ff511c" }} name="icon_close"></Icon>
            </View>
            <View className="Dialog-content" style={{ height: "100rem", display: "flex", flexDirection: "row", alignItems: "center" }}>
              <Text className="Dialog-content-text marginLeft65" style={{ fontSize: "30rem", color: "#333", paddingLeft: "10rem" }}> 自动代扣失败，请使用手动支付</Text>
            </View>
            <View className="MyShowModal-btns">
              <Text className="MyShowModal-btns-item MyShowModal-cancleBtn" style={{ color: '#888' }} onClick={() => this.autoPaymentErrorShowModalByClose()}>关闭</Text>
              <Text className="MyShowModal-btns-item" onClick={() => this.autoPaymentErrorShowModalByConfirm()}>手动支付</Text>
            </View>
          </View>
        </MyShowModal>

        {/* 自动代扣成功，提示 */}
        <MyShowModal showModalActive={this.state.isShowModalByAutoPaymentSuccess} btns={false} title={'提示'} tRClose={false} shadeClose={true}  cancelhowModal={()=>this.autoPaymentSuccessShowModalByConfirm()}>
          <View className="Dialog-wrap" >
            <View className="Dialog-content">
              <Icon className="infomation-circle" style={{ color: "#77bf04" }} name="success-circle"></Icon>
              <Text className="Dialog-content-text marginLeft65" style={{ fontSize: "30rem", color: "#666", paddingLeft: "15rem" }}>已对{this.state.autoPaymentSuccessPayingOrderIds.length}笔采购单发起免密支付</Text>
              {this.state.autoPaymentSuccessNotWaitPayIds.length > 0 ? <Text className="Dialog-content-text marginLeft65" style={{ fontSize: "30rem", color: "#666", paddingLeft: "15rem" }}>有{this.state.autoPaymentSuccessNotWaitPayIds.length}个订单不属于待付款！</Text> : null}
              {this.state.autoPaymentSuccessFaildOrderIds.length > 0 ? <Text className="Dialog-content-text marginLeft65" style={{ fontSize: "30rem", color: "#666", paddingLeft: "15rem" }}>有{this.state.autoPaymentSuccessFaildOrderIds.length}个订单发起失败！</Text> : null}
              <Text className="Dialog-content-text marginLeft65" style={{ fontSize: "30rem", color: "#666", paddingLeft: "15rem" }}>请耐心等待支付结果</Text>
            </View>
            <View className="MyShowModal-btns">
              <Text className="MyShowModal-btns-item" onClick={() => this.autoPaymentSuccessShowModalByConfirm()}>确认</Text>
            </View>
          </View>
        </MyShowModal>


        {/* 取消订单，点击后一秒弹出 */}
        <MyShowModal showModalActive={this.state.isShowModalByCancelExamine} btns={false} title={'确定'} tRClose={false} shadeClose={true}  cancelhowModal={()=>this.closeModal("isShowModalByCancelExamine")}>
          <View className="Dialog-wrap" >
            <View className="Dialog-content" style={{ textAlign: "center" }}>
              <Text className="Dialog-content-text" style={{ fontSize: "30rem", color: "#666", textAlign: "center" }}> 是否已成功取消了订单？</Text>
            </View>
            <View className="MyShowModal-btns">
              <Text className="MyShowModal-btns-item MyShowModal-cancleBtn" onClick={() => this.cancelExamineShowModalByClose()}>关闭</Text>
              <Text className="MyShowModal-btns-item" onClick={() => this.cancelExamineShowModalByConfirm()}>已取消并刷新</Text>
            </View>
          </View>
        </MyShowModal>



        {/* 获取支付方式，有错误的 提示弹框，提示 */}
        <MyShowModal showModalActive={this.state.isShowModalBySelectPaymentError} btns={false} title={'获取支付方式失败'} tRClose={false} shadeClose={true} cancelhowModal={()=>this.closeModal("isShowModalBySelectPaymentError")}>
          <View className="Dialog-wrap" >
            <View className="Dialog-content newDialog-content">
              <ScrollView style={{ flex: 1 }}>
                <View className="newDialog-content-tr"><Text className="newDialog-content-td">订单编号</Text><Text className="newDialog-content-td">错误类型</Text></View>
                {
                  this.state.getPaymentErrorFaildOrderList.map((item) =>
                    <View className="newDialog-content-tr">
                      <Text className="newDialog-content-td" style={{ color: "#888" }}>{item}</Text>
                      <Text className="newDialog-content-td" style={{ color: "#888" }}>支付渠道失败</Text>
                    </View>
                  )
                }
                {
                  this.state.getPaymentErrorNotWaitPayIds.map((item) =>
                    <View className="newDialog-content-tr">
                      <Text className="newDialog-content-td" style={{ color: "#888" }}>{item}</Text>
                      <Text className="newDialog-content-td" style={{ color: "#888" }}>不是待支付的订单</Text>
                    </View>
                  )
                }
                {
                  this.state.getPaymentErrorPayChannelsList.map((item) =>
                    <View className="newDialog-content-tr">
                      <Text className="newDialog-content-td" style={{ color: "#888" }}>{item.OrderId}</Text>
                      <Text className="newDialog-content-td" style={{ color: "#888" }}>支付渠道不一致</Text>
                    </View>
                  )
                }
              </ScrollView>
            </View>


            <View className="MyShowModal-btns">
              <Text className="MyShowModal-btns-item MyShowModal-cancleBtn" style={{ marginRight: 0 }} onClick={() => this.selectPaymentErrorShowModalByClose()}>关闭</Text>
            </View>
          </View>
        </MyShowModal>

        {/* 获取支付链接（手动支付的方式），跳转后，弹出给用户确认 */}
        <MyShowModal showModalActive={this.state.isShowModalByPayUrl} btns={false} title={'提示'} tRClose={false} shadeClose={true} cancelhowModal={()=>this.closeModal("isShowModalByPayUrl")} >
          <View className="Dialog-wrap" >
            <View className="Dialog-content">
              <Text className="Dialog-content-text" style={{ fontSize: "30rem", color: "#666", textAlign: "center" }}> 是否已手动支付成功？</Text>
            </View>
            <View className="MyShowModal-btns">
              <Text className="MyShowModal-btns-item MyShowModal-cancleBtn" style={{ color: '#888' }} onClick={() => this.payUrlShowModalByClose()}>关闭</Text>
              <Text className="MyShowModal-btns-item" onClick={() => this.payUrlShowModalByConfirm()}>已支付并刷新</Text>  {/* 确认和关闭，都会刷新一次*/}
            </View>
          </View>
        </MyShowModal>

        {/* 获取支付链接（手动支付的方式），有错误的 提示弹框，提示 */}
        <MyShowModal showModalActive={this.state.isShowModalByPayUrlError} btns={false} title={'手动支付链接失败'} tRClose={false} shadeClose={true} cancelhowModal={()=>this.closeModal("isShowModalByPayUrlError")} >
          <View className="Dialog-wrap" >
            <View className="Dialog-content newDialog-content">
              <ScrollView style={{ flex: 1 }}>

                <View className="newDialog-content-tr"><Text className="newDialog-content-td">订单编号</Text><Text className="newDialog-content-td">错误类型</Text></View>

                {
                  this.state.getPayUrlErrorFaildOrderList.map((item) =>
                    <View className="newDialog-content-tr">
                      <Text className="newDialog-content-td" style={{ color: "#888" }} >{item}</Text>
                      <Text className="newDialog-content-td" style={{ color: "#888" }} >支付渠道失败</Text>
                    </View>
                  )
                }
                {
                  this.state.getPayUrlErrorPayChannelsList.map((item) =>
                    <View className="newDialog-content-tr">
                      <Text className="newDialog-content-td" style={{ color: "#888" }}>{item}</Text>
                      <Text className="newDialog-content-td" style={{ color: "#888" }}>支付渠道不一致</Text>
                    </View>
                  )
                }
              </ScrollView>
            </View>
            <View className="MyShowModal-btns">
              <Text className="MyShowModal-btns-item MyShowModal-cancleBtn" style={{ color: '#888' }} onClick={() => this.payUrlErrorShowModalByClose()}>关闭</Text>
            </View>
          </View>
        </MyShowModal>

        {/* 点击待付款时，检查是否开通了代扣，但是开关没开启 */}
        {/* <MyShowModal showModalActive={this.state.isShowModalByOpenUpAndNotOpen} btns={false} title={'提示'} tRClose={false}> 
            <View className="Dialog-wrap" >
              <View className="Dialog-content">
                <Text className="Dialog-content-text"  style={{fontSize:"28rem",color:"#000"}}>检测到您已开通了自动代扣，没有开启</Text>
                <Text className="Dialog-content-text">是否开启自动代扣？</Text>
              </View>
              <View className="MyShowModal-btns">
              <Text className="MyShowModal-btns-item MyShowModal-cancleBtn" style={{ color: '#888' }} onClick={() => this.openUpAndNotOpenShowModalByClose()}>关闭</Text>
                <Text className="MyShowModal-btns-item" onClick={() => this.openUpAndNotOpenShowModalByConfirm()}>立即开启</Text>
              </View>
            </View>         
        </MyShowModal> */}

        <MyShowModal showModalActive={this.state.isShowAuth} btns={false} title={'提示'} titleClose={true} tRClose={false} shadeClose={true}  cancelhowModal={()=>this.closeModal("isShowAuth")}>
          <View className="Dialog-wrap" >
            <View className="MyShowModal-contentCenter">
              <Icon className="infomation-circle MyShowModal-icon" name="infomation-circle"></Icon>
            </View>
            <View className="MyShowModal-contentCenter">
              <Text className="Dialog-content-text" style={{ fontSize: "25rem", color: "#888"}}>您有店铺授权已失效，请前往店铺列表进行授权。</Text>
              <Text className="Dialog-content-text" style={{ fontSize: "25rem", color: "#888" }}>授权失效将不能进行订单回流采购和自动发货</Text>
            </View>
            <View className="MyShowModal-btns">
              <Text className="MyShowModal-btns-item MyShowModal-cancleBtn" onClick={() => this.closeModal("isShowAuth")}>关闭</Text>
              <Text className="MyShowModal-btns-item" onClick={() => this.gotoShopList()}>前往授权</Text>
            </View>
          </View>
        </MyShowModal>
        <MyShowModal showModalActive={this.state.isShowAuthSuccess} btns={false} title={'提示'} titleClose={true} tRClose={false} shadeClose={true}  cancelhowModal={()=>this.closeModal("isShowAuthSuccess")}>
            <View className="Dialog-wrap" >
              <View className="Dialog-content">
                <Text className="Dialog-content-text" style={{ fontSize: "28rem", paddingTop: 30, paddingBottom: 30 }}>完成【授权】后，请根据情况进行确认</Text>
              </View>
              <View className="MyShowModal-btns">
                <Text className="MyShowModal-btns-item MyShowModal-cancleBtn" style={{ color: '#333' }} onClick={() => this.closeModal("isShowAuthSuccess")}>关闭</Text>
                <Text className="MyShowModal-btns-item" onClick={() => this.authConfirmOk()}>完成授权</Text>
              </View>
            </View>
          </MyShowModal>

        {/* 公共错误 */}
        <MyShowModal showModalActive={this.state.isShowCommonError} btns={false} title={'错误提示'} tRClose={false} shadeClose={true}  cancelhowModal={()=>this.closeModal("isShowCommonError")}>
          <View className="Dialog-wrap" >
            <View className="MyShowModal-contentCenter" style={{ display: "flex", flexDirection: "column" }}>
              <ScrollView style={{ flex: 1 }}>
                <Text>{this.state.showCommonErrorMessage}</Text>
              </ScrollView>
            </View>
            <View className="MyShowModal-btns">
              <Text className="MyShowModal-btns-item" onClick={() => this.closeModal("isShowCommonError")}>确认关闭</Text>
            </View>
          </View>
        </MyShowModal>


        <Dialog.Alert ref="onlineSendErrorMsgRef"
          okText={'关闭'}
          titleText={'发货失败原因'}
          contentStyle={
            {
              height: "300rem"
            }
          }
        >{this.state.onlineSendErrorMessage}</Dialog.Alert>

        <MyShowLoading isLoadingActive={this.state.myShowLoading} showLoadingTitle={this.state.showLoadingTitle} />
        <NewGuide newGuideName={"/ZhuKeSystem/IsFirstUse"} guideBackgroundName={"caigouHelp-01.png"} guideSteps={
          [
            { index: 0, isShow: true, wPositon: { top: 0, left: 0 }, imgName: "caigouHelp_02.png", imgSize: { width: "634rem", height: "270rem" }, tPositon: { top: "217rem", left: "236rem" } },
            { index: 1, isShow: false, wPositon: { top: "118rem", left: 0 }, imgName: "caigouHelp_03.png", imgSize: { width: "750rem", height: "299rem" }, tPositon: { top: "246rem", left: "236rem" } },
            { index: 2, isShow: false, wPositon: { top: "200rem", left: 0 }, imgName: "caigouHelp_04.png", imgSize: { width: "496rem", height: "288rem" }, tPositon: { top: "232rem", left: "178rem" } },
            { index: 3, isShow: false, wPositon: { bottom: "30rem", left: 0 }, imgName: "caigouHelp_05.png", imgSize: { width: "602rem", height: "527rem" }, tPositon: { top: "463rem", left: "314rem" } },
            { index: 4, isShow: false, wPositon: { bottom: "130rem", left: 0 }, imgName: "caigouHelp_06.png", imgSize: { width: "750rem", height: "273rem" }, tPositon: { top: "67rem", left: "261rem" } }
          ]
        } />

      </RoxStyleProvider>
    );
  }

}




render(<ProcurementOrder />);
