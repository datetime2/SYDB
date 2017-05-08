using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using SYDB.TaskSchedu;

namespace SYDB.Infrastructure.UnitTest
{
    [TestClass]
    public class UnitTest1
    {
        [TestMethod]
        public void BulidGame()
        {
            new GameBulidJob().BulidGame();
        }

        [TestMethod]
        public void InsertAdmin()
        {

        }
    }
}
