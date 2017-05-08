using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SYDB.Infrastructure.Entity
{
    /// <summary>
    /// 投注状态
    /// </summary>
    public enum BetStatus
    {
        /// <summary>
        /// 成功
        /// </summary>
		[Description("成功")]
        Success = 0,
        /// <summary>
        /// 用户不存在或被锁定
        /// </summary>
		[Description("用户不存在或被锁定")]
        UserUndefine,
        /// <summary>
        /// 余额不足
        /// </summary>
        [Description("余额不足")]
        AmountNotEnough,
        /// <summary>
        /// 投注时间截止
        /// </summary>
        [Description("投注时间截止")]
        BetTimeEnd,
        /// <summary>
        /// 投注金额不在允许范围内
        /// </summary>
        [Description("投注金额不在允许范围内")]
        AmountOverRange,
        /// <summary>
        /// 失败
        /// </summary>
        [Description("失败")]
        Failure
    }
    /// <summary>
    /// 金额流水类型
    /// </summary>
    public enum FlowType
    {
        /// <summary>
        /// 充值
        /// </summary>
        [Description("充值")]
        Recharge = 0,
        /// <summary>
        /// 投注
        /// </summary>
        [Description("投注")]
        Bet,
        /// <summary>
        /// 提现
        /// </summary>
        [Description("提现")]
        Cash,
        /// <summary>
        /// 奖励
        /// </summary>
        [Description("奖励")]
        Offers
    }
    /// <summary>
    /// 体现类型
    /// </summary>
    public enum CashType
    {
        /// <summary>
        /// 微信
        /// </summary>
        [Description("微信")]
        WeiXin = 0,
        /// <summary>
        /// 银行卡
        /// </summary>
        [Description("银行卡")]
        Bank
    }

    /// <summary>
    /// 充值类型
    /// </summary>
    public enum PayType
    {
        /// <summary>
        /// 微信
        /// </summary>
        [Description("微信")]
        WeiXin = 0,
        /// <summary>
        /// 支付宝
        /// </summary>
        [Description("支付宝")]
        ZhiFuBao
    }
    /// <summary>
    /// 充值状态
    /// </summary>
    public enum PayState
    {
        /// <summary>
        /// 成功
        /// </summary>
        [Description("成功")]
        Success = 0,
        /// <summary>
        /// 待支付
        /// </summary>
        [Description("待支付")]
        WaitPay,
        /// <summary>
        /// 失败
        /// </summary>
        [Description("失败")]
        Failure
    }
    public enum MenuType
    {
        /// <summary>
        /// 菜单
        /// </summary>
        [Description("菜单")]
        Menu = 0,
        /// <summary>
        /// 按钮
        /// </summary>
        [Description("按钮")]
        Button
    }
}
