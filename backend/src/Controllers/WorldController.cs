namespace SimpleWorldGen.Controllers;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SimpleWorldGen.DTO;

public class WorldController : Controller
{
    const int PAGE_SIZE = 20;

    [HttpPost]
    public async Task<ActionResult<WorldResponseDTO>> CreateWorld([FromBody] PostWorldDTO world)
    {
        // Create world logic
    }

    [HttpPut]
    public async Task<ActionResult<WorldResponseDTO>> UpdateWorld([FromBody] PutWorldDTO world)
    {
        // Update world logic
    }

    [HttpGet]
    public ActionResult<WorldResponseDTO> GetWorld([FromQuery] string worldId)
    {
        // Get world logic
    }

    [HttpGet]
    public ActionResult<IEnumerable<WorldInfoResponseDTO>> GetWorlds([FromQuery] string search, [FromQuery] int page)
    {
        // Get worlds logic
    }

    [HttpGet]
    public ActionResult<IEnumerable<WorldInfoResponseDTO>> GetOwnWorlds([FromBody] string sessionToken, [FromQuery] string search, [FromQuery] int page)
    {
        // Get own worlds logic
    }
}