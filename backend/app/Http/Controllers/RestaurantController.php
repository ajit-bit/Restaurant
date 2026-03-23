<?php

namespace App\Http\Controllers;

use App\Repositories\RestaurantRepository;
use Illuminate\Http\Request;

class RestaurantController extends Controller
{
    protected $repo;

    public function __construct(RestaurantRepository $repo)
    {
        $this->repo = $repo;
    }

    public function index(Request $request)
    {
        return response()->json(
            $this->repo->getAll($request->all())
        );
    }

    public function show($id)
    {
        return response()->json(
            $this->repo->find($id)
        );
    }
}